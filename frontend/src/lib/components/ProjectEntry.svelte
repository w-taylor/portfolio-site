<script>

    let {imgSrc, projTitle, descText, projLink, linkText} = $props();

</script>

<div class="project-container">
    <img src={imgSrc} class="preview-img">
    <div class="description-box">
        <div class="project-title"><b>{@html projTitle}</b></div>
        <br />
        <div class="description-text">{@html descText}</div>
        <br />
        <div class="project-link"><a href={projLink}>&lt;{linkText}&gt;</a></div>
    </div>
</div>

<style>
    .project-container {
        display: flex;
        justify-content: center;
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