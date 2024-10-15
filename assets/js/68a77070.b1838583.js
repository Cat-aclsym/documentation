"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[2353],{7365:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>d,contentTitle:()=>l,default:()=>g,frontMatter:()=>t,metadata:()=>r,toc:()=>c});var s=n(4848),i=n(8453);const t={title:"Logger",sidebar_position:20,description:"Ingame debug logger"},l="Logger",r={id:"development/guides/logger",title:"Logger",description:"Ingame debug logger",source:"@site/docs/development/guides/logger.md",sourceDirName:"development/guides",slug:"/development/guides/logger",permalink:"/documentation/docs/development/guides/logger",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/development/guides/logger.md",tags:[],version:"current",sidebarPosition:20,frontMatter:{title:"Logger",sidebar_position:20,description:"Ingame debug logger"},sidebar:"tutorialSidebar",previous:{title:"Debug console",permalink:"/documentation/docs/development/guides/console"},next:{title:"How to ?",permalink:"/documentation/docs/development/models/how-to"}},d={},c=[{value:"Model",id:"model",level:2},{value:"Utilisation",id:"utilisation",level:2},{value:"Outputs",id:"outputs",level:2}];function a(e){const o={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(o.header,{children:(0,s.jsx)(o.h1,{id:"logger",children:"Logger"})}),"\n",(0,s.jsxs)(o.p,{children:["Vous pouvez retrouver le code source du logger dans ",(0,s.jsx)(o.code,{children:"res://scripts/log/"}),"."]}),"\n",(0,s.jsx)(o.h2,{id:"model",children:"Model"}),"\n",(0,s.jsx)(o.p,{children:(0,s.jsx)(o.img,{alt:"logger model",src:n(9334).A+""})}),"\n",(0,s.jsx)(o.h2,{id:"utilisation",children:"Utilisation"}),"\n",(0,s.jsxs)(o.p,{children:["Pour une utilisation plus efficace du logger, ajouter le ",(0,s.jsx)(o.a,{href:"/documentation/docs/development/guides/snippets#trace-log",children:"snippet"})," \xe0 votre IDE.\r\nExemple d'appel :"]}),"\n",(0,s.jsx)(o.pre,{children:(0,s.jsx)(o.code,{className:"language-go",children:'Log.trace(Log.Level.INFO, "Hello World!")\n'})}),"\n",(0,s.jsx)(o.h2,{id:"outputs",children:"Outputs"}),"\n",(0,s.jsx)(o.admonition,{type:"warning",children:(0,s.jsxs)(o.p,{children:["Si la variable global ",(0,s.jsx)(o.code,{children:"debug"})," dans le fichier ",(0,s.jsx)(o.code,{children:"res://scripts/autoload/global.gd"})," n'est pas \xe0 ",(0,s.jsx)(o.code,{children:"true"}),", aucun log de niveau ",(0,s.jsx)(o.code,{children:"Log.Level.Debug"})," ne sortira."]})}),"\n",(0,s.jsx)(o.p,{children:"La sortie se compose comme ceci"}),"\n",(0,s.jsx)(o.pre,{children:(0,s.jsx)(o.code,{className:"language-log",children:"[LEVEL] hh:mm:ss.ms - path/to/script::line@method_name - message\n"})}),"\n",(0,s.jsx)(o.p,{children:"Par exemple"}),"\n",(0,s.jsx)(o.pre,{children:(0,s.jsx)(o.code,{className:"language-log",children:"[ INFO] 13:19:39.485 - res://scripts/log/log.gd::27@init - Logger initialized!\n"})}),"\n",(0,s.jsx)(o.p,{children:"Les logs sont redirig\xe9s"}),"\n",(0,s.jsxs)(o.ol,{children:["\n",(0,s.jsx)(o.li,{children:"Dans la sortie standard de la console godot"}),"\n",(0,s.jsxs)(o.li,{children:["Dans la console de debug int\xe9gr\xe9e \xe0 Cat'aclysm ",(0,s.jsxs)(o.em,{children:["(cf. ",(0,s.jsx)(o.a,{href:"/documentation/docs/development/guides/console",children:"console"}),")"]})]}),"\n",(0,s.jsxs)(o.li,{children:["Dans un fichier g\xe9n\xe9r\xe9 \xe0 chaque nouvelle session dans ",(0,s.jsx)(o.code,{children:"res://log/"}),". Le nom du fichier de log est g\xe9n\xe9r\xe9 comme suit : ",(0,s.jsx)(o.code,{children:"YYYY_MM_DD-hh_mm.log"}),", par exemple : ",(0,s.jsx)(o.code,{children:"2024_10_15-13_19.log"})]}),"\n"]})]})}function g(e={}){const{wrapper:o}={...(0,i.R)(),...e.components};return o?(0,s.jsx)(o,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},9334:(e,o,n)=>{n.d(o,{A:()=>s});const s=n.p+"assets/images/logger.drawio-eb703efdc6a608160c083b372a4c0ca4.svg"},8453:(e,o,n)=>{n.d(o,{R:()=>l,x:()=>r});var s=n(6540);const i={},t=s.createContext(i);function l(e){const o=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function r(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:l(e.components),s.createElement(t.Provider,{value:o},e.children)}}}]);