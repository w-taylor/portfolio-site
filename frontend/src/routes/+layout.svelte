<script>
  import '../lib/style/global.css';
  import { page } from '$app/stores';

  function getPageTitle(pathname) {
    switch (pathname) {
      case '/conway':
        return 'Conway\'s Game of Life | wtaylor.xyz';
      case '/pingboard':
        return 'Pingboard | wtaylor.xyz';
      case '/shortcut':
        return 'ShortCut | wtaylor.xyz';
      default:
        return 'wtaylor.xyz';
    }
  }

  let menuDisplay = $state("none");

  function toggleMenu(){
    if (menuDisplay === "none"){
      menuDisplay = "flex";
    } else {
      menuDisplay = "none"
    }
  }
</script>

<svelte:head>
  <title>{getPageTitle($page.url.pathname)}</title>
</svelte:head>

<div class="header-wrapper">
  <div class="header-left"><a href="/"><strong>&lt;wtaylor.xyz&gt;</strong></a></div>
  <div class="header-right">
    <nav>
      <a href="https://github.com/w-taylor" class="github-link" target="_blank" rel="noopener noreferrer"><img src="/images/github-mark.png" style="height: 1em; width: 1em;"></a> |
      <a href="/#projects-header">&lt;Projects&gt;</a> | 
      <a href="/#site-info-header">&lt;Site Info&gt;</a> | 
      <a href="/#contact-header">&lt;Contact&gt;</a>
    </nav>

    <div class="mobile-only">
      <label for="menu-toggle" class="hamburger" onclick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </label>
      
      <!-- Mobile menu -->
      <div class="mobile-menu" style="display: {menuDisplay};">
        <a href="https://github.com/w-taylor" class="github-link" target="_blank" rel="noopener noreferrer" onclick={toggleMenu}><img src="/images/github-mark.png" style="height: 1em; width: 1em;"></a>
        <a href="/#projects-header" onclick={toggleMenu}>&lt;Projects&gt;</a> 
        <a href="/#site-info-header" onclick={toggleMenu}>&lt;Site&nbsp;Info&gt;</a> 
        <a href="/#contact-header" onclick={toggleMenu}>&lt;Contact&gt;</a>
      </div>
    </div>
  </div>
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

  .mobile-only {
    display: none;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 21px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: auto 2em;
  }

  .hamburger span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: black;
    border-radius: 3px;
  }

  .mobile-menu {
    position: absolute;
    top: 5em;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    padding: 1em 0;
    z-index: 1;
  }

  .mobile-menu a {
    padding: 0.75em 2em;
    text-decoration: none;
    color: black;
    font-size: 1.2em;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: center;
  }

  .mobile-menu a:last-child {
    border-bottom: none;
  }

  .mobile-menu a:hover {
    background-color: #f9f9f9;
  }

  @media (max-width: 768px) {
    nav {
      display: none;
    }

    .mobile-only {
      display: flex;
    }

    .footer-left {
      font-size: .65em;
    }
  }

</style>
