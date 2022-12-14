<script lang="ts">
	let url = '';
	let shortLinkUrl = '';
	let isLoading = false;
	let copied = false;

	const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

	let urlInput: HTMLInputElement;

	$: urlValid = urlPattern.test(url);
	$: {
		if (urlInput) {
			if (!!url && !urlValid) {
				urlInput.setCustomValidity('Invalid URL');
			} else {
				urlInput.setCustomValidity('');
			}
		}
	}
	$: copyText = copied ? 'Copied to clipboard ✓' : 'Copy to clipboard.';

	async function createShortLink() {
		isLoading = true;

		let response = await fetch('create', { method: 'post', body: url });

		let body = await response.json();

		shortLinkUrl = window.location.origin + '/' + body.id;

		isLoading = false;
		copied = false;
	}

	function copyToClipboard() {
		copied = true;
		navigator.clipboard.writeText(shortLinkUrl);
	}
</script>

<div class="h-screen w-screen flex flex-col p-10 items-center">
	<h1 class="text-5xl font-bold text-center uppercase brand mb-8">Shorty</h1>
	<h4 class="text-2xl italic text-center mb-20 text-gray-700 dark:text-gray-50">
		A fast and lightweight <span class="brand font-bold">link shortener</span>.
	</h4>

	<div
		class="border rounded p-6 sm:p-8 flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-4 justify-between w-11/12 sm:w-3/4 lg:w-1/2 items-center sm:items-end"
	>
		<div class="w-11/12 sm:w-1/3">
			<label for="url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
				URL
			</label>
			<input
				type="text"
				id="url"
				class="peer bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 invalid:border-red-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg block p-2.5 dark:placeholder-gray-400 w-full focus:outline-none"
				placeholder="https://www.google.com"
				bind:value={url}
				bind:this={urlInput}
			/>
			<p class="invisible peer-invalid:visible text-red-600 font-light absolute z-10">
				Please enter a valid URL.
			</p>
		</div>

		<button
			class="w-24 h-12 grid place-content-center text-white bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-75 disabled:cursor-not-allowed focus:ring-2 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
			disabled={!urlValid}
			on:click={createShortLink}
			type="button"
		>
			{#if isLoading}
				<div role="status">
					<svg
						aria-hidden="true"
						class="w-6 h-6 animate-spin text-gray-600 fill-gray-100"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
					<span class="sr-only">Loading...</span>
				</div>
			{:else}
				Shorten
			{/if}
		</button>

		<div class="w-11/12 sm:w-1/3">
			<label for="url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
				Shortlink
			</label>
			<div class="relative">
				<input
					type="text"
					id="url"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  w-full"
					placeholder="..."
					bind:value={shortLinkUrl}
					disabled
				/>
				<button
					type="button"
					class="tt-container text-white absolute right-0 bottom-0 font-medium rounded-lg text-sm px-2 h-full disabled:pointer-events-none"
					on:click={copyToClipboard}
					disabled={shortLinkUrl === ''}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 384 512"
						class="w-7 h-5 text-gray-600 hover:text-gray-400 disabled:text-gray-300 dark:text-gray-200 dark:hover:text-gray-300  dark:disabled:text-gray-500 active:text-blue-300"
						fill="currentColor"
						><path
							d="M384 96L384 0h-112c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48H464c26.51 0 48-21.49 48-48V128h-95.1C398.4 128 384 113.6 384 96zM416 0v96h96L416 0zM192 352V128h-144c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h192c26.51 0 48-21.49 48-48L288 416h-32C220.7 416 192 387.3 192 352z"
						/></svg
					>
					<span
						class="tt-text bg-gray-800 text-white absolute p-3 rounded-md -left-1/2 top-full w-32"
						class:text-green-400={copied}>{copyText}</span
					>
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.brand {
		background: -webkit-linear-gradient(0deg, #a955f7, #ec4899);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		white-space: nowrap;
	}

	.tt-container .tt-text {
		visibility: hidden;
	}

	.tt-container:hover .tt-text {
		visibility: visible;
	}
</style>
