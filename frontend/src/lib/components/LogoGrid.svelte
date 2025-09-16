<script>
    import TechLogo from '$lib/components/TechLogo.svelte';
</script>

<div class="logo-grid">
    <TechLogo imgName="HTML5.png" imgTxt="HTML" />
    <TechLogo imgName="CSS3.png" imgTxt="CSS" />
    <TechLogo imgName="JavaScript.png" imgTxt="JavaScript" />
    <TechLogo imgName="Vue.js.png" imgTxt="Vue.js" />
    <TechLogo imgName="Svelte.png" imgTxt="Svelte" />
    <TechLogo imgName="Node.js.png" imgTxt="Node.js" />
    <TechLogo imgName="Python.png" imgTxt="Python" />
    <TechLogo imgName="Bash.png" imgTxt="Bash" />
    <TechLogo imgName="PostgresSQL.png" imgTxt="Postgres" />
    <TechLogo imgName="Docker.png" imgTxt="Docker" />
    <TechLogo imgName="Linux.png" imgTxt="Linux" />
    <TechLogo imgName="Git.png" imgTxt="Git" />
</div>

<style>
    .logo-grid{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto auto auto auto;
        width: 30vw;
    }

</style>