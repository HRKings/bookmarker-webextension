<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'virtual:windi.css'
import { sendMessage } from 'webext-bridge'
import { serverUrl } from '~/logic/storage'
import { getOpenGraphTags } from '~/utils/ogParsing'

const [show, toggle] = useToggle(false)

const message = ref('Can\'t get tab')
const color = ref('text-white')

async function addBookmark() {
  const currentUrl = (await sendMessage('getCurrentTab', {})).url ?? ''

  if (currentUrl === '') {
    toggle()
    setTimeout(() => { toggle() }, 2000)
    return
  }

  const ogTags = getOpenGraphTags(document)

  const response = await fetch(`${serverUrl.value}/api/v1/bookmark/full`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: currentUrl,
      title: ogTags.title,
      description: ogTags.description,
      imageUrl: ogTags.imageUrl,
      imageAlt: ogTags.imageAlt,
      ogType: ogTags.ogType,
      videoUrl: ogTags.videoUrl,
    }),
  })

  if (response.ok) {
    message.value = 'Success!'
    color.value = 'text-green'
  }
  else {
    const responseFull = await fetch(`${serverUrl.value}/api/v1/bookmark/full`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: currentUrl }),
    })

    if (responseFull.ok) {
      message.value = 'Success!'
      color.value = 'text-green'
    }
    else {
      message.value = `${responseFull.status} ${responseFull.statusText}`
      color.value = 'text-red'
    }
  }

  toggle()
  setTimeout(() => { toggle() }, 2000)
}
</script>

<template>
  <div class="fixed right-0 bottom-0 m-5 z-100 flex font-sans select-none leading-1em">
    <div
      class="bg-white text-gray-800 rounded-full shadow w-max h-min"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
      :class="show ? 'opacity-100' : 'opacity-0'"
    >
      {{ message }}
    </div>
    <div
      class="flex w-10 h-10 rounded-full shadow cursor-pointer"
      bg="teal-600 hover:teal-700"
      @click="addBookmark()"
    >
      <bi:bookmark class="block m-auto text-lg {{color}}" />
    </div>
  </div>
</template>
