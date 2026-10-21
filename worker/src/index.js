// Cloudflare Worker: authenticated repository saves for authorized DM editors.
// Deployment instructions: docs/repository-sync.md
const json = (v,status=200,headers={}) => new Response(JSON.stringify(v),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...headers}});
const random = () => crypto.randomUUID()+crypto.randomUUID();
const allowed = (login,env) => (env.EDITORS||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean).includes(login.toLowerCase());
const ghHeaders = token => ({"authorization":"Bearer "+token,"accept":"application/vnd.github+json","x-github-api-version":"2022-11-28"});
const fail = (message,status=400)=>json({error:message},status);
async function gh(url,token,options={}) {
  return fetch("https://api.github.com"+url,{...options,headers:{...ghHeaders(token),...(options.headers||{})}});
}
function originHeaders(req,env) {
  const origin=req.headers.get("origin");
  return origin===env.DASHBOARD_ORIGIN?{"access-control-allow-origin":origin,"access-control-allow-methods":"GET,PUT,OPTIONS","access-control-allow-headers":"Authorization,Content-Type","vary":"Origin"}:{};
}
function redirect(url){return new Response(null,{status:302,headers:{"location":url,"cache-control":"no-store"}})}
const utf8ToBase64 = text => {
  const bytes=new TextEncoder().encode(text);
  let output="";for(let i=0;i<bytes.length;i+=8192)output+=String.fromCharCode(...bytes.slice(i,i+8192));
  return btoa(output);
};
function base64ToUtf8(text) {
  const raw=atob(text.replace(/\s/g,""));const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
async function currentEditor(req,env) {
  const header=req.headers.get("authorization")||"";
  if(!header.startsWith("Bearer ")) return null;
  const session=await env.SESSIONS.get("session:"+header.slice(7),"json");
  if(!session||!allowed(session.login,env))return null;
  return session;
}
export default {
  async fetch(request,env) {
    const url=new URL(request.url);
    const cors=originHeaders(request,env);
    const reply=(v,status=200)=>json(v,status,cors);
    if(request.method==="OPTIONS") {
      if(request.headers.get("origin")!==env.DASHBOARD_ORIGIN)return fail("Origin not allowed",403);
      return new Response(null,{status:204,headers:cors});
    }
    if(!env.REPO||!/^[-\w.]+\/[-\w.]+$/.test(env.REPO)||!env.DASHBOARD_ORIGIN)return reply({error:"Server not configured"},503);
    if(url.pathname==="/auth/start"&&request.method==="GET") {
      const nonce=random();
      await env.SESSIONS.put("oauth:"+nonce,"1",{expirationTtl:600});
      const callback=new URL("/auth/callback",request.url).toString();
      const target=new URL("https://github.com/login/oauth/authorize");
      target.searchParams.set("client_id",env.GITHUB_CLIENT_ID);
      target.searchParams.set("redirect_uri",callback);
      target.searchParams.set("scope","repo read:user");
      target.searchParams.set("state",nonce);
      return redirect(target.toString());
    }
    if(url.pathname==="/auth/callback"&&request.method==="GET") {
      const nonce=url.searchParams.get("state")||"";
      const stored=nonce&&await env.SESSIONS.get("oauth:"+nonce);
      if(!stored)return fail("Invalid or expired login state",403);
      await env.SESSIONS.delete("oauth:"+nonce);
      const code=url.searchParams.get("code");
      if(!code)return fail("GitHub authentication was cancelled",400);
      const tokens=await fetch("https://github.com/login/oauth/access_token",{
        method:"POST",headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code})
      });
      const tokenInfo=await tokens.json();
      if(!tokens.ok||!tokenInfo.access_token)return fail("GitHub sign-in failed",401);
      const token=tokenInfo.access_token;
      const profile=await gh("/user",token);
      if(!profile.ok)return fail("Cannot verify GitHub identity",403);
      const user=await profile.json();
      if(!allowed(user.login,env))return fail("This GitHub account is not an approved editor",403);
      const permission=await gh("/repos/"+env.REPO+"/collaborators/"+encodeURIComponent(user.login)+"/permission",token);
      if(!permission.ok)return fail("Could not check repository permission",403);
      const result=await permission.json();
      if(!["admin","maintain","write"].includes(result.permission))return fail("GitHub write access is required",403);
      const sessionId=random();
      await env.SESSIONS.put("session:"+sessionId,JSON.stringify({login:user.login,token}),{expirationTtl:43200});
      const target=new URL(env.DASHBOARD_URL);
      target.hash="rfl_sync_session="+encodeURIComponent(sessionId);
      return redirect(target.toString());
    }
    if(!url.pathname.startsWith("/api/"))return fail("Not found",404);
    if(request.headers.get("origin")!==env.DASHBOARD_ORIGIN)return reply({error:"Origin not allowed"},403);
    const editor=await currentEditor(request,env);
    if(!editor)return reply({error:"Sign in to GitHub as an approved editor"},401);
    if(url.pathname==="/api/me"&&request.method==="GET")return reply({login:editor.login});
    if(url.pathname==="/api/logout"&&request.method==="PUT") {
      await env.SESSIONS.delete("session:"+request.headers.get("authorization").slice(7));
      return reply({ok:true});
    }
    if(url.pathname==="/api/state"&&["GET","PUT"].includes(request.method)) {
      const path=env.STATE_PATH||"private-data/editor-state.json";
      const endpoint="/repos/"+env.REPO+"/contents/"+path.split("/").map(encodeURIComponent).join("/");
      if(request.method==="GET"){
        const response=await gh(endpoint,editor.token);
        if(response.status===404)return reply({sha:null,data:null});
        if(!response.ok)return reply({error:"GitHub read failed",status:response.status},502);
        const file=await response.json();
        if(file.encoding!=="base64")return reply({error:"Unexpected GitHub response"},502);
        try{return reply({sha:file.sha,data:JSON.parse(base64ToUtf8(file.content))});}
        catch{return reply({error:"Invalid saved campaign JSON"},502);}
      }
      if(Number(request.headers.get("content-length")||0)>1000000)return reply({error:"Payload too large"},413);
      const raw=await request.text();
      if(raw.length>1000000)return reply({error:"Payload too large"},413);
      let input;try{input=JSON.parse(raw);}catch{return reply({error:"Invalid JSON"},400);}
      if(!input||typeof input!=="object"||!Object.prototype.hasOwnProperty.call(input,"data")
        ||!(input.sha===null||typeof input.sha==="string"))return reply({error:"Expected data and sha"},400);
      const read=await gh(endpoint,editor.token);
      if(![200,404].includes(read.status))return reply({error:"Could not check current revision"},502);
      const current=read.status===200?(await read.json()).sha:null;
      if(current!==input.sha)return reply({error:"Another editor saved changes. Reload before saving.",currentSha:current},409);
      const commitBody={message:"Save DM dashboard edits by @"+editor.login,content:utf8ToBase64(JSON.stringify(input.data,null,2)),committer:undefined};
      if(current)commitBody.sha=current;
      const write=await gh(endpoint,editor.token,{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(commitBody)});
      if(!write.ok)return reply({error:write.status===409?"Conflicting GitHub commit":"GitHub save failed",status:write.status},write.status===409?409:502);
      const saved=await write.json();
      return reply({ok:true,sha:saved.content.sha,commit:saved.commit.html_url});
    }
    return reply({error:"Not found"},404);
  }
};