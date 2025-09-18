<script>
  import '../lib/style/global.css';
</script>

<div class="header-wrapper">
  <div class="header-left"><h1 class="site-name">wtaylor.xyz</h1></div>
  <div class="header-right"><nav>
    <a href="#projects-header">Projects</a> | 
    <a href="#site-info-header">Site Info</a> | 
    <a href="#contact-header">Contact</a>
  </nav></div>
</div>

<div class="header-spacer"></div>

<slot />

<style>
  .header-wrapper {
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    position: absolute;
    display: grid;
    grid-template-columns: 30%;
    grid-auto-rows: 2em;
    color: black;
  }

  .header-left {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    clip-path: polygon(0 0,100% 0,80% 100%,0 100%);
    background-color: white;
    color: black;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
    grid-column: 1 / 4;
    grid-row: 1;
    background-color: white;
    color: black;
  }

  .header-spacer {
    height: 7em;
  }

  .site-name{
    font-size: 2em;
  }

  .site-name, nav{
    margin: .25em .5em;
  }

</style>