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
        <div class="intro-box-left">
            <p>Hello! I'm William, a full stack developer located in Austin, Texas. I love creating frontend user interfaces, developing backend scripts for business logic, and crafting efficient SQL queries. Take a look at my projects below if you want to see some of what I've been working on lately.</p>

            <div style="display: flex;">Here's a link to my <a href="https://github.com/w-taylor" style="display: flex; align-items: center; justify-content: center;">&nbsp;&lt;<img src="/images/github-mark-white.png" style="height: 1em; width: 1em; vertical-align: middle;">&thinsp;Github&gt;</a></div>
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
        imgSrc="/images/conway-preview.png"
        projTitle="Conway's <i>Game of Life</i>"
        descText="An implentation of Conway's <i>Game of Life</i> cellular automata simulation using Svelte 5"
        projLink="http://localhost:8080/conway"
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

    <p>This site uses the Portable Site project as a template, with a Svelte frontend, Node.js api server, Postgres database, and deployed in a Docker container. Sveltekit was used for allowing multiple pages unlike the SPA setup in the Portable Template</p>
    <p>A lot of what was used here is probably overkill for a simple site like this, it's mostly an excuse to play with these different technologies.</p>
    <p>You can find the code for this site <a href="https://github.com/w-taylor/portfolio-site">&lt;here&gt;</a></p>

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

    <p>If you'd like to get in touch or want to recieve a resume, you can email me at <a href="mailto:william@wtaylor.xyz">&lt;william@wtaylor.xyz&gt;</a></p>

</div>

