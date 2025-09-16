<script>
    export let imgName = "";
    export let imgTxt = "";
    let imgSrc = "/images/" + imgName;
</script>

<div class="tech-logo-cont">
<img src="{imgSrc}" width="75" height="75" >
<p>{imgTxt}</p>
</div>


<style>
.tech-logo-cont {
    width: 150px;
    height: 150px;
    text-align: center;
}
</style>