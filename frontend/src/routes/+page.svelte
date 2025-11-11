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
            <p>Hello! I'm William, a full stack developer located in Austin, Texas. I love creating frontend user interfaces, developing backend scripts for business logic, and crafting efficient SQL queries. Take a look at my projects below if you want to see some of what I've been working on lately.</p>

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

    <p class="text-blurb">This site uses the Portable Site project as a template, with a Svelte frontend, Node.js api server, Postgres database, Nginx reverse-proxy, and deployed in a Docker container. Sveltekit was used for allowing multiple pages unlike the SPA setup in the Portable Template</p>
    <p class="text-blurb">A lot of what was used here is probably overkill for a simple site like this, it's mostly an excuse to play with these different technologies.</p>
    <p class="text-blurb">HTTPS is set up for this site using <a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">&lt;Certbot&gt;</a>, huge thanks to <a href="https://www.eff.org/" target="_blank" rel="noopener noreferrer">&lt;EFF&gt;</a> for maintaining the utility and <a href="https://letsencrypt.org/" target="_blank" rel="noopener noreferrer">&lt;Let's Encrypt&gt;</a> for providing the certificates.</p>
    <p class="text-blurb">You can find the code for this site <a href="https://github.com/w-taylor/portfolio-site" target="_blank" rel="noopener noreferrer">&lt;here&gt;</a></p>

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

    <p class="text-blurb">If you'd like to get in touch or want to recieve a resume, you can email me at <a href="mailto:william@wtaylor.xyz">&lt;william@wtaylor.xyz&gt;</a></p>

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
