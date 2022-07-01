<script setup lang="ts">
import { serverUrl } from '~/logic/storage'

const message = ref('')

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function addBookmark() {
  const currentUrl = (await browser.tabs.query({ currentWindow: true, active: true }))[0].url ?? ''

  if (currentUrl === '')
    return

  const response = await fetch(`${serverUrl.value}/api/v1/bookmark/url`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: currentUrl }),
  })

  if (response.ok)
    message.value = 'Success!'

  else
    message.value = `${response.status} ${response.statusText}`
}
</script>

<template>
  <main class="popup">
    <Logo />
    <h1>Bookmarker</h1>

    <div>
      <button class="btn mt-2" @click="addBookmark">
        Add Bookmark
      </button>
    </div>

    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>

    <div class="mt-2">
      <span class="opacity-50">Connected to server:</span> {{ serverUrl }}
    </div>
    <div class="mt-2">
      {{ message }}
    </div>
  </main>
</template>

<style scoped>
.popup {
  width: 15rem;
  text-align: center;
  font-weight: 700;
  color: gray;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.popupBody {
  opacity: 50%;
  margin-top: 0.5rem;
}
</style>
