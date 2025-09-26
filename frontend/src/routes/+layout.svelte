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

<div class="footer-spacer"></div>

<div class="footer-wrapper">
  <div class="footer-left">
    <div class="footer-left-text">
      <div style="font-size: 3em;"><strong>wtaylor.xyz</strong></div>
      <div>© 2025 William Taylor</div>
    </div>
  </div>
  <div class="footer-right">
    <a href="" class="footer-link">Home</a>
    <a href="#projects-header" class="footer-link">Projects</a>
    <a href="#site-info-header" class="footer-link">Site Info</a>
    <a href="#contact-header" class="footer-link">Contact</a>
  </div>
</div>

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

  .footer-wrapper {
    background-color: white;
    color: black;
    display: grid; 
    grid-template-columns: 1fr 1fr;
    height: 8em;
  }

  .footer-left {
    margin: auto 0;
    border-right: .05em solid black; 
    height: 6em;
    text-align: right;
  }

  .footer-left-text {
    display: block;
    padding-right: 2.5em;
  }

  .footer-right {
    margin: auto 0;
  }

  .footer-link{
    display: block;
    margin: .25em 0;
    padding-left: 2.5em;
  }

  .footer-spacer {
    height: 8em;
  }

  .site-name{
    font-size: 2em;
  }

  .site-name, nav{
    margin: .25em .5em;
  }

</style>