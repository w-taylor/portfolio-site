<script>
    export let imgName = "";
    export let imgTxt = "";
    let imgSrc = "/images/" + imgName;
</script>

<div class="tech-logo-cont">
<img src="{imgSrc}" class="tech-logo-img" >
<p class="tech-logo-caption">{imgTxt}</p>
</div>


<style>
.tech-logo-cont {
    text-align: center;
    margin: 1em;
}

.tech-logo-caption {
    margin: 0.2em;
}

.tech-logo-img {
    height: 3.5em;
    width: 3.5em;
}

</style>