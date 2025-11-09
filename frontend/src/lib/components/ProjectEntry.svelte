<script>

    let {imgSrc, projTitle, descText, projLink, linkText} = $props();

</script>

<div class="project-container">
    {#if linkText !== "Live Project"}
    <a href={projLink} target="_blank" rel="noopener noreferrer"><img src={imgSrc} class="preview-img"></a>
    {:else}
    <a href={projLink}><img src={imgSrc} class="preview-img"></a>
    {/if}
    
    <div class="description-box">
        <div class="project-title"><b>{@html projTitle}</b></div>
        <br />
        <div class="description-text">{@html descText}</div>
        <br />
        {#if linkText !== "Live Project"}
         <div class="project-link"><a href={projLink} target="_blank" rel="noopener noreferrer">&lt;{linkText}&gt;</a></div>
        {:else}
        <div class="project-link"><a href={projLink}>&lt;{linkText}&gt;</a></div>
        {/if}
        
    </div>
</div>

<style>
    .project-container {
        display: flex;
        justify-content: center;
        margin-top: 1.5em;
    }

    .preview-img {
        width: 12em;
        height: 12em;
        border: .1em solid white;
        border-radius: 1em;
    }

    .description-box {
        width: calc(100% - 12em);
        padding: 1em 3em;
    }

    .project-title {
        font-size: 1.5em;
    }

</style>