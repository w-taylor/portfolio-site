<script>
    import { browser } from '$app/environment';

    let shortUrl = $state("");
    let longUrl = $state("");
    let errorMsg = $state("");
    let recentLinks = $state([]);

    // Get saved recentLinks, if any
    if (browser) {
        const saved = localStorage.getItem('recentLinks');
        if (saved) {
            recentLinks = JSON.parse(saved);
        }
    }

    let hasRecentLinks = $derived(recentLinks.length > 0);

    async function getCode() {
        errorMsg = "";
        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: longUrl.trim() })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                shortUrl = "http://localhost:8080/link/" + data.shortUrl;
                
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
            }
            } catch (err) {
                errorMsg = 'Network error - please try again';
            }
    }

    $inspect(shortUrl);

</script>

<div class="shortcut-main-content">
    <div>ShortCut</div>
    <div>Description of how to use with example</div>
    <div class="shortcut-panel">
        {#if errorMsg}
            <div class="shortcut-error-display">{errorMsg}</div>
        {/if}
        <div>Enter URL</div>
        <input type="url" bind:value={longUrl} />
        <button onclick={getCode} role="button">Submit</button>
        {#if shortUrl}
            <div class="shortcut-result">
                Your link is: {shortUrl}
                <a href="{shortUrl}" target="_blank" rel="noopener noreferrer">Try it out!</a>
            </div>
        {/if}
    </div>
    {#if hasRecentLinks}
        <div class="recent-links">
            <div>Recent Links</div>
            {#each recentLinks as link (link.shortCode)}
                <div class="link-item">
                    <a 
                        href={link.shortUrl} 
                        target="_blank" 
                        class="short-link"
                        rel="noopener noreferrer"
                    >
                        {link.shortUrl}
                    </a>
                    <div class="original-url" title={link.originalUrl}>
                        {link.originalUrl}
                    </div>
                    <div class="link-meta">
                        Created {new Date(link.createdAt).toLocaleDateString()}
                    </div>
                </div>
            {/each}
        </div>
    {/if}

</div>

<style>

</style>