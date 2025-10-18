<script>
    let shortCode = $state("");
    let longUrl = $state("");
    let errorMsg = $state("");

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
                shortCode = data.shortUrl;
                longUrl = '';
            } else {
                errorMsg = data.error || 'Failed to shorten URL';
            }
            } catch (err) {
                errorMsg = 'Network error - please try again';
            }
    }

    $inspect(shortCode);

</script>

<div class="shortcut-main-content">
    <div>ShortCut</div>
    <div>Description of how to use with example</div>
    <div class="shortcut-panel">
        <div>Enter URL</div>
        <input type="url" bind:value={longUrl} />
        <div onclick={getCode}>Submit</div>
        <div class="shortcut-result">
            Your link is: http://localhost:8080/link/{shortCode}
            <a href="http://localhost:8080/link/{shortCode}" target="_blank">Try it out!</a>
        </div>
    </div>
</div>

<style>

</style>