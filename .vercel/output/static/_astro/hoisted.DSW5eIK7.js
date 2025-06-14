import"./hoisted.Dqsdwzo9.js";function d(e,a){const t=new URLSearchParams(window.location.search);e&&t.set("search",e),a&&t.set("category",a),window.history.replaceState({},"",`${window.location.pathname}?${t.toString()}`)}const y=document.getElementById("search-input"),g=document.querySelectorAll(".category-btn");y?.addEventListener("input",e=>{const a=e.target.value;d(a,"")});g.forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-category")||"";d("",a)})});const m=document.getElementById("search-input"),p=document.querySelectorAll("article");m?.addEventListener("input",e=>{const a=e.target.value.toLowerCase();p.forEach(t=>{const r=t.querySelector("h2")?.textContent?.toLowerCase()||"",s=t.querySelector("p")?.textContent?.toLowerCase()||"",n=Array.from(t.querySelectorAll(".tag")).map(o=>o.textContent?.toLowerCase());r.includes(a)||s.includes(a)||n.some(o=>o.includes(a))?(t.style.display="block",t.style.opacity="0",t.style.transform="translateY(20px)",setTimeout(()=>{t.style.opacity="1",t.style.transform="translateY(0)"},50)):(t.style.opacity="0",t.style.transform="translateY(-20px)",setTimeout(()=>{t.style.display="none"},300))})});const c=document.querySelectorAll(".category-btn"),u=document.querySelectorAll("article");c.forEach(e=>{e.addEventListener("click",()=>{c.forEach(t=>{t.classList.remove("active","bg-blue-600","text-white","font-bold"),t.classList.add("bg-gray-100","dark:bg-gray-800","text-gray-700","dark:text-gray-200","font-semibold"),t.style.opacity="1",t.style.pointerEvents="auto"}),e.classList.add("active","bg-blue-600","text-white","font-bold"),e.classList.remove("bg-gray-100","dark:bg-gray-800","text-gray-700","dark:text-gray-200","font-semibold"),e.style.opacity="1",e.style.pointerEvents="auto";const a=e.getAttribute("data-category");u.forEach(t=>{const r=t.getAttribute("data-tags")?.split(",")||[];a==="all"||r.includes(a)?(t.style.display="block",t.style.opacity="0",t.style.transform="translateY(20px)",setTimeout(()=>{t.style.opacity="1",t.style.transform="translateY(0)"},50)):(t.style.opacity="0",t.style.transform="translateY(-20px)",setTimeout(()=>{t.style.display="none"},300))})})});const h=6;let l=!1;async function f(){if(l)return;const e=document.getElementById("load-more"),a=document.getElementById("loading-spinner"),t=parseInt(e?.dataset.page||"1");try{l=!0,e?.classList.add("opacity-50","cursor-not-allowed"),a?.classList.remove("hidden");const s=await(await fetch(`/api/posts?page=${t+1}&limit=${h}`)).json();if(s.posts.length>0){const n=document.querySelector(".posts-grid");s.posts.forEach(i=>{const o=x(i);n?.appendChild(o)}),e?.setAttribute("data-page",(t+1).toString()),t+1>=s.totalPages&&(e?.setAttribute("disabled","true"),e?.classList.add("opacity-50","cursor-not-allowed"))}else e?.setAttribute("disabled","true"),e?.classList.add("opacity-50","cursor-not-allowed")}catch(r){console.error("Error al cargar más posts:",r)}finally{l=!1,e?.classList.remove("opacity-50","cursor-not-allowed"),a?.classList.add("hidden")}}function x(e){const a=document.createElement("article");return a.className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transform hover:-translate-y-1",a.setAttribute("data-tags",e.tags.join(",")),a.innerHTML=`
      <a href="/blog/${e.slug}" class="block">
        <div class="p-6">
          <div class="space-y-3">
            <time datetime="${e.pubDate}" class="text-sm text-gray-500 dark:text-gray-400">
              ${new Date(e.pubDate).toLocaleDateString("es-ES",{year:"numeric",month:"long",day:"numeric"})}
            </time>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 line-clamp-2">
              ${e.title}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 line-clamp-3">
              ${e.description}
            </p>
            ${e.tags.length>0?`
              <div class="flex flex-wrap gap-2 pt-2">
                ${e.tags.map(t=>`
                  <span class="tag inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 transition-all duration-200 hover:scale-105 hover:bg-primary-100 dark:hover:bg-primary-900">
                    ${t}
                  </span>
                `).join("")}
              </div>
            `:""}
          </div>
        </div>
      </a>
    `,a}document.getElementById("load-more")?.addEventListener("click",f);
