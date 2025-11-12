<script>
    import LogoGrid from '$lib/components/LogoGrid.svelte';
    import MainPageBreak from '$lib/components/MainPageBreak.svelte';
    import ProjectEntry from '../lib/components/ProjectEntry.svelte';
</script>

<div class="main-page-content">
    <pre class="section-header"> 
:::       ::: :::::::::: :::        ::::::::   ::::::::  ::::    ::::  :::::::::: 
:+:       :+: :+:        :+:       :+:    :+: :+:    :+: +:+:+: :+:+:+ :+:        
+:+       +:+ +:+        +:+       +:+        +:+    +:+ +:+ +:+:+ +:+ +:+        
+#+  +:+  +#+ +#++:++#   +#+       +#+        +#+    +:+ +#+  +:+  +#+ +#++:++#   
+#+ +#+#+ +#+ +#+        +#+       +#+        +#+    +#+ +#+       +#+ +#+        
 #+#+# #+#+#  #+#        #+#       #+#    #+# #+#    #+# #+#       #+# #+#        
  ###   ###   ########## ########## ########   ########  ###       ### ########## 
    </pre>
    
    <div class="intro-box">
        <div class="intro-box-left text-blurb">
            <p>Hi, I'm William, a full-stack developer based in Austin.<br/><br/>I build dynamic user interfaces, robust backend systems, and efficient databases. I strive to create applications that are as intuitive for the user as they are technically sound under the hood. You can find a selection of some of my recent projects below.</p>

            <div style="display: flex;">Here's a link to my <a href="https://github.com/w-taylor" style="display: flex; align-items: center; justify-content: center;" target="_blank" rel="noopener noreferrer">&nbsp;&lt;<img src="/images/github-mark-white.png" style="height: 1em; width: 1em; vertical-align: middle;">&thinsp;Github&gt;</a></div>
            <br />
        </div>
    
        <div class="intro-box-right">
            <LogoGrid />
        </div>
    </div>

    <MainPageBreak />

    <pre class="section-header" id="projects-header"> 
:::::::::  :::::::::   ::::::::  ::::::::::: :::::::::: :::::::: ::::::::::: ::::::::  
:+:    :+: :+:    :+: :+:    :+:     :+:     :+:       :+:    :+:    :+:    :+:    :+: 
+:+    +:+ +:+    +:+ +:+    +:+     +:+     +:+       +:+           +:+    +:+        
+#++:++#+  +#++:++#:  +#+    +:+     +#+     +#++:++#  +#+           +#+    +#++:++#++ 
+#+        +#+    +#+ +#+    +#+     +#+     +#+       +#+           +#+           +#+ 
#+#        #+#    #+# #+#    #+# #+# #+#     #+#       #+#    #+#    #+#    #+#    #+# 
###        ###    ###  ########   #####      ########## ########     ###     ########  
    </pre>

    <ProjectEntry 
        imgSrc="/images/port-site-preview.png"
        projTitle="Portable Site Template"
        descText="Template for quickly getting started with a simple SPA site. Dockerized with a Svelte frontend, Node.js API server, Postgres database, and Nginx reverse proxy. Includes a basic To-Do app as an example but intended to be used as a jumping off point."
        projLink="https://github.com/w-taylor/portable-template"
        linkText="Github Repo"
    />

    <ProjectEntry 
        imgSrc="/images/pingboard-preview.png"
        projTitle="Pingboard"
        descText="Monitors performance of api endpoints by running scheduled requests and storing the results using Svelte 5, Node.js, and Postgres"
        projLink="/pingboard"
        linkText="Live Project"
    />

    <ProjectEntry 
        imgSrc="/images/shortcut-preview.png"
        projTitle="ShortCut"
        descText="Creates shortened, usable redirect links to long URLs using Svelte 5, Node.js, and Postgres"
        projLink="/shortcut"
        linkText="Live Project"
    />

    <ProjectEntry 
        imgSrc="/images/conway-preview.png"
        projTitle="Conway's <i>Game of Life</i>"
        descText="An implentation of Conway's <i>Game of Life</i> cellular automata simulation using Svelte 5"
        projLink="/conway"
        linkText="Live Project"
    />

    <MainPageBreak />

    <pre class="section-header" id="site-info-header"> 
 :::::::: ::::::::::: ::::::::::: ::::::::::      ::::::::::: ::::    ::: :::::::::: ::::::::  
:+:    :+:    :+:         :+:     :+:                 :+:     :+:+:   :+: :+:       :+:    :+: 
+:+           +:+         +:+     +:+                 +:+     :+:+:+  +:+ +:+       +:+    +:+ 
+#++:++#++    +#+         +#+     +#++:++#            +#+     +#+ +:+ +#+ :#::+::#  +#+    +:+ 
       +#+    +#+         +#+     +#+                 +#+     +#+  +#+#+# +#+       +#+    +#+ 
#+#    #+#    #+#         #+#     #+#                 #+#     #+#   #+#+# #+#       #+#    #+# 
 ######## ###########     ###     ##########      ########### ###    #### ###        ########  
    </pre>

    <p class="text-blurb">
        This site uses the Portable Site project as a template, with a Svelte frontend, Node.js api server, Postgres database, Nginx reverse-proxy, and deployed in a Docker container. Sveltekit was used for allowing multiple pages unlike the SPA setup in the Portable Template <br /><br />
        A lot of what was used here is probably overkill for a simple site like this, it's mostly an excuse to play with these different technologies.<br /><br />
        HTTPS is set up for this site using <a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">&lt;Certbot&gt;</a>, huge thanks to <a href="https://www.eff.org/" target="_blank" rel="noopener noreferrer">&lt;EFF&gt;</a> for maintaining the utility and <a href="https://letsencrypt.org/" target="_blank" rel="noopener noreferrer">&lt;Let's Encrypt&gt;</a> for providing the certificates.<br /><br />
        You can find the code for this site <a href="https://github.com/w-taylor/portfolio-site" target="_blank" rel="noopener noreferrer">&lt;here&gt;</a>
    </p>

    <MainPageBreak />

    <pre class="section-header" id="contact-header"> 
 ::::::::   ::::::::  ::::    ::: ::::::::::: :::      :::::::: ::::::::::: 
:+:    :+: :+:    :+: :+:+:   :+:     :+:   :+: :+:   :+:    :+:    :+:     
+:+        +:+    +:+ :+:+:+  +:+     +:+  +:+   +:+  +:+           +:+     
+#+        +#+    +:+ +#+ +:+ +#+     +#+ +#++:++#++: +#+           +#+     
+#+        +#+    +#+ +#+  +#+#+#     +#+ +#+     +#+ +#+           +#+     
#+#    #+# #+#    #+# #+#   #+#+#     #+# #+#     #+# #+#    #+#    #+#     
 ########   ########  ###    ####     ### ###     ###  ########     ###     
    </pre>

    <div style="display: flex; justify-content: center;"><p class="text-blurb">If you'd like to get in touch or want to recieve a resume, you can email me at&nbsp;<a href="mailto:william@wtaylor.xyz">&lt;william@wtaylor.xyz&gt;</a></p></div>

</div>

<style>
    .main-page-content {
        width: 70vw;
        margin: auto;
    }

    .section-header {
        text-align: center;
    }

    .intro-box {
        display: flex;
    }

    .intro-box > div {
        flex: 1;
    }

    .intro-box-left {
        font-size: 1.25em;
        line-height: 1.5em;
    }

    .intro-box-right {
        display: flex;
        justify-content: center;
    }

    @media (max-width: 768px) {
        .main-page-content {
            width: 95vw;
            font-size: 10px;
        }

        .section-header {
            font-size: 7px;
        }

        .intro-box {
            flex-direction: column;
        }

        .text-blurb {
            width: 80vw;
            margin: 0 auto;
        }
    }

</style>
