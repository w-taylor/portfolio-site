<script>
    import { browser } from '$app/environment';
    import { page } from '$app/stores';

    let shortUrl = $state("");
    let longUrl = $state("");
    let errorMsg = $state("");
    let recentLinks = $state([]);
    const baseUrl = `${$page.url.origin}/link/`;
    const MAX_URL_LEN = 2000;

    // Get saved recentLinks, if any
    if (browser) {
        const saved = localStorage.getItem('recentLinks');
        if (saved) {
            recentLinks = JSON.parse(saved);
        }
    }

    let hasRecentLinks = $derived(recentLinks.length > 0);

    async function getCode(event) {
        event.preventDefault();

        errorMsg = "";

        if (longUrl.trim().length >= MAX_URL_LEN) {
            errorMsg = 'URL must be under 2000 characters!';
            shortUrl = '';
            return;
        }

        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: longUrl.trim() })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                shortUrl = baseUrl + data.shortUrl;
                
                // Add to recent links and update localStorage
                recentLinks = [
                {
                    shortUrl: shortUrl,
                    originalUrl: longUrl,
                    createdAt: new Date().toISOString()
                },
                ...recentLinks.slice(0, 4)
                ];

                if (browser) {
                    localStorage.setItem('recentLinks', JSON.stringify(recentLinks));
                }
                

                longUrl = '';
            } else {
                errorMsg = data.error || 'Failed to shorten URL - plesase try again';
                shortUrl = '';
            }
            } catch (err) {
                errorMsg = 'Network error - please try again';
                shortUrl = '';
            }
    }

</script>

<div class="shortcut-main-content">
    <div class="shortcut-title">ShortCut</div>
    <div class="shortcut-instructions">
        Use this tool to create a handy redirect link for a long URL.
        <br /><br />
        Paste your original URL below and hit "Submit" to get the new link, which will be six random characters put on the end of {baseUrl}
        <br /><br />
        For example, &lt;<a href="{baseUrl}bp46j3" target="_blank" rel="noopener noreferrer">{baseUrl}bp46j3</a>&gt; will redirect to https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s
    </div>
    <div class="shortcut-panel">
        <div class="panel-content">
        {#if errorMsg}
            <div class="shortcut-error-display">{errorMsg}</div><br />
        {/if}
        
        <form onsubmit={getCode}>
            <div>Enter URL</div>
            <input type="text" bind:value={longUrl} />
            <button type="submit">Submit</button>
        </form>
        
        {#if shortUrl}
            <br /><br />
            <div class="shortcut-result">
                Your link is: {shortUrl}
                <br /><br />
                &lt;<a href="{shortUrl}" target="_blank" rel="noopener noreferrer">Try it out!</a>&gt;
            </div>
        {/if}
        </div>
    </div>
    {#if hasRecentLinks}
        <div class="recent-links-title">Recent Links</div>
        <div class="recent-links">
        {#each recentLinks as link (link.shortUrl)}
            <div class="link-item">
                &lt;<a 
                    href={link.shortUrl} 
                    target="_blank" 
                    class="short-link"
                    rel="noopener noreferrer"
                >
                    {link.shortUrl}
                </a>&gt; redirects to:
                <br /><br />
                <div class="original-url" title={link.originalUrl}>
                    {link.originalUrl}
                </div>
                <br />
                <div class="link-meta">
                    Created {new Date(link.createdAt).toLocaleDateString()}
                </div>
            </div>
        {/each}
        </div>
    {/if}

</div>

<style>
    .shortcut-main-content {
        margin: 0 auto;
        max-width: 50vw;
        min-height: calc(100vh - 28em);
    }
    
    .shortcut-title {
        justify-content: center;
        display: flex;
        font-size: 5em;
        margin-bottom: 0.5em;
    }

    .shortcut-instructions{
        font-size: 1.2em;
    }

    .shortcut-panel {
        display: flex;
        justify-content: center;
    }

    .panel-content {
        border: solid white .1em;
        border-radius: .2em;
        padding: 1.5em;
        margin: 3em auto;
    }

    .shortcut-error-display{
        color: red;
        display: flex;
        justify-content: center;
    }

    .link-item {
        border-top: solid white .1em;
        margin: .5em 0;
        padding-top: .5em;
        overflow-wrap: anywhere;
    }

    .recent-links-title {
        display: flex;
        justify-content: center;
        font-size: 2em;
    }

    @media (max-width: 768px) {
        .shortcut-main-content {
            max-width: 90vw;
        }
    }

</style>