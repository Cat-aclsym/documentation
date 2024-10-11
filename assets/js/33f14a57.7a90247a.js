"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[8163],{1415:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var r=i(4848),t=i(8453);const o={title:"Git Workflow",sidebar_position:100,description:"Documentation dashboard"},s="Gitflow Workflow",a={id:"git-workflow",title:"Git Workflow",description:"Documentation dashboard",source:"@site/docs/git-workflow.md",sourceDirName:".",slug:"/git-workflow",permalink:"/documentation/docs/git-workflow",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/git-workflow.md",tags:[],version:"current",sidebarPosition:100,frontMatter:{title:"Git Workflow",sidebar_position:100,description:"Documentation dashboard"},sidebar:"tutorialSidebar",previous:{title:"off-game",permalink:"/documentation/docs/development/user-flows/off-game"},next:{title:"Useful Links",permalink:"/documentation/docs/useful-links"}},l={},c=[{value:"Qu&#39;est-ce que Gitflow ?",id:"quest-ce-que-gitflow-",level:2},{value:"Branches principales : develop et main",id:"branches-principales--develop-et-main",level:2},{value:"Branches de fonctionnalit\xe9 (feature branches)",id:"branches-de-fonctionnalit\xe9-feature-branches",level:2},{value:"Cr\xe9er une branche de fonctionnalit\xe9",id:"cr\xe9er-une-branche-de-fonctionnalit\xe9",level:3},{value:"Fusionner une branche de fonctionnalit\xe9",id:"fusionner-une-branche-de-fonctionnalit\xe9",level:3},{value:"Branches de release",id:"branches-de-release",level:2},{value:"Cr\xe9er une branche de release",id:"cr\xe9er-une-branche-de-release",level:2},{value:"Finaliser une branche de release",id:"finaliser-une-branche-de-release",level:2},{value:"Branches de hotfix",id:"branches-de-hotfix",level:2},{value:"Cr\xe9er une branche de hotfix",id:"cr\xe9er-une-branche-de-hotfix",level:3},{value:"Finaliser une branche de hotfix",id:"finaliser-une-branche-de-hotfix",level:3}];function d(e){const n={blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"gitflow-workflow",children:"Gitflow Workflow"})}),"\n",(0,r.jsx)(n.h2,{id:"quest-ce-que-gitflow-",children:"Qu'est-ce que Gitflow ?"}),"\n",(0,r.jsx)(n.p,{children:"Gitflow est un mod\xe8le de branchement Git alternatif qui repose sur l'utilisation de branches de fonctionnalit\xe9s et de plusieurs branches principales."}),"\n",(0,r.jsx)(n.p,{children:"Sous Gitflow, les d\xe9veloppeurs cr\xe9ent une branche de fonctionnalit\xe9 et retardent la fusion avec la branche principale jusqu'\xe0 ce que la fonctionnalit\xe9 soit compl\xe8te."}),"\n",(0,r.jsx)(n.p,{children:"Ce workflow d\xe9finit des r\xf4les sp\xe9cifiques pour chaque branche et comment elles doivent interagir."}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsx)(n.p,{children:"Si vous souhaitez utiliser un autre outil que git cli, demmerdez vous, merci"}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h2,{id:"branches-principales--develop-et-main",children:"Branches principales : develop et main"}),"\n",(0,r.jsx)(n.p,{children:"Gitflow utilise deux branches principales pour g\xe9rer l'historique du projet :"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["La branche ",(0,r.jsx)(n.code,{children:"main"})," stocke l'historique des versions officielles."]}),"\n",(0,r.jsxs)(n.li,{children:["La branche ",(0,r.jsx)(n.code,{children:"develop"})," est utilis\xe9e pour int\xe9grer les nouvelles fonctionnalit\xe9s."]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"branches-de-fonctionnalit\xe9-feature-branches",children:"Branches de fonctionnalit\xe9 (feature branches)"}),"\n",(0,r.jsx)(n.p,{children:"Chaque nouvelle fonctionnalit\xe9 doit \xeatre d\xe9velopp\xe9e dans sa propre branche, bas\xe9e sur develop. Lorsque la fonctionnalit\xe9 est compl\xe8te, elle est fusionn\xe9e dans develop. Les branches de fonctionnalit\xe9 n'interagissent jamais directement avec main."}),"\n",(0,r.jsx)(n.h3,{id:"cr\xe9er-une-branche-de-fonctionnalit\xe9",children:"Cr\xe9er une branche de fonctionnalit\xe9"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git checkout develop\r\ngit pull --rebase\r\ngit checkout -b feature/nom_fonctionnalit\xe9\n"})}),"\n",(0,r.jsx)(n.h3,{id:"fusionner-une-branche-de-fonctionnalit\xe9",children:"Fusionner une branche de fonctionnalit\xe9"}),"\n",(0,r.jsx)(n.p,{children:"Une fois la fonctionnalit\xe9 termin\xe9e, il est temps de la fusionner dans develop."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git checkout develop\r\ngit merge feature/nom_fonctionnalit\xe9\r\ngit branch -d feature/nom_fonctionnalit\xe9\n"})}),"\n",(0,r.jsx)(n.h2,{id:"branches-de-release",children:"Branches de release"}),"\n",(0,r.jsx)(n.p,{children:"Lorsque la branche develop contient suffisamment de nouvelles fonctionnalit\xe9s pour une version ou qu'une date de publication approche, une branche de release est cr\xe9\xe9e \xe0 partir de develop."}),"\n",(0,r.jsx)(n.p,{children:"\xc0 partir de ce moment, seules les corrections de bugs et les t\xe2ches li\xe9es \xe0 la release sont autoris\xe9es sur cette branche."}),"\n",(0,r.jsx)(n.h2,{id:"cr\xe9er-une-branche-de-release",children:"Cr\xe9er une branche de release"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git checkout develop\r\ngit checkout -b release/nom_release\n"})}),"\n",(0,r.jsx)(n.h2,{id:"finaliser-une-branche-de-release",children:"Finaliser une branche de release"}),"\n",(0,r.jsx)(n.p,{children:"Une fois pr\xeate, la branche de release est fusionn\xe9e dans main et develop, puis supprim\xe9e."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git checkout main\r\ngit merge release/nom_release\r\ngit checkout develop\r\ngit merge release/nom_release\n"})}),"\n",(0,r.jsx)(n.h2,{id:"branches-de-hotfix",children:"Branches de hotfix"}),"\n",(0,r.jsx)(n.p,{children:"Les branches de hotfix sont utilis\xe9es pour appliquer rapidement des correctifs sur la production."}),"\n",(0,r.jsx)(n.p,{children:"Elles sont cr\xe9\xe9es \xe0 partir de main, et une fois le correctif termin\xe9, elles sont fusionn\xe9es dans main et develop."}),"\n",(0,r.jsx)(n.h3,{id:"cr\xe9er-une-branche-de-hotfix",children:"Cr\xe9er une branche de hotfix"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git checkout main\r\ngit checkout -b hotfix/nom_hotfix\n"})}),"\n",(0,r.jsx)(n.h3,{id:"finaliser-une-branche-de-hotfix",children:"Finaliser une branche de hotfix"}),"\n",(0,r.jsx)(n.p,{children:"Lorsque le correctif est pr\xeat, il est fusionn\xe9 dans main et develop."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"git checkout main\r\ngit merge hotfix/nom_hotfix\r\ngit checkout develop\r\ngit merge hotfix/nom_hotfix\r\ngit branch -d hotfix/nom_hotfix\n"})})]})}function u(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>s,x:()=>a});var r=i(6540);const t={},o=r.createContext(t);function s(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);