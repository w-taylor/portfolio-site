<script>
  import '../lib/style/global.css';
</script>

<div class="header-wrapper">
  <div class="header-left"><a href="/"><strong>&lt;wtaylor.xyz&gt;</strong></a></div>
  <div class="header-right"><nav>
    <a href="https://github.com/w-taylor" class="github-link" target="_blank" rel="noopener noreferrer"><img src="/images/github-mark.png" style="height: 1em; width: 1em;"></a> |
    <a href="/#projects-header">&lt;Projects&gt;</a> | 
    <a href="/#site-info-header">&lt;Site Info&gt;</a> | 
    <a href="/#contact-header">&lt;Contact&gt;</a>
  </nav></div>
</div>

<div class="header-spacer"></div>

<slot />

<div class="footer-spacer"></div>

<div class="footer-wrapper">
  <div class="footer-left">
    <div class="footer-left-text">
      <div style="font-size: 3em;"><a href="/"><strong>&lt;wtaylor.xyz&gt;</strong></a></div>
      <div>© 2025 William Taylor</div>
    </div>
  </div>
  <div class="footer-right">
    <div class="footer-link"><a href="/#projects-header">&lt;Projects&gt;</a></div>
    <div class="footer-link"><a href="/#site-info-header">&lt;Site Info&gt;</a></div>
    <div class="footer-link"><a href="/#contact-header">&lt;Contact&gt;</a></div>
  </div>
</div>

<style>
  .header-wrapper {
    width: 100%;
    margin: 0;
    background-color: white;
    color: black;
    display: grid; 
    grid-template-columns: 1fr 1fr;
    height: 5em;
  }

  .header-left {
    font-size: 3em;
    margin: auto 0.5em;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
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

  nav {
    margin: auto 2em;
    font-size: 1.5em;
    display: flex;
    align-items: center;
  }

  nav > a {
    margin: 0 0.25em;
  }

  .github-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
