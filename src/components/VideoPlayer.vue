<template>
  <div ref="artRef" class="artplayer-app"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  style: {
    type: Object,
    default: () => ({}),
  },
});

const artRef = ref(null);
const instance = ref(null);

const emit = defineEmits(['loaded', 'error']);

function initPlayer() {
  if (instance.value) {
    try {
      instance.value.destroy(false);
    } catch (e) {
      // Ignore destroy errors
    }
  }

  nextTick(() => {
    if (!artRef.value) return;

    instance.value = new Artplayer({
      ...props.option,
      container: artRef.value,
      customType: {
        m3u8: function (video, url, art) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on('destroy', () => hls.destroy());
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
               emit('loaded'); // Signal ready when HLS manifest parses
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
               if (data.fatal) emit('error', data);
            });

          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
               emit('loaded');
            });
          } else {
            art.notice.show = 'Unsupported playback format: m3u8';
            emit('error', 'Unsupported format');
          }
        },
      },
    });

    // Native events
    instance.value.on('video:canplay', () => {
      emit('loaded');
    });
    
    instance.value.on('video:error', () => {
      emit('error');
    });
  });
}

onMounted(() => {
  initPlayer();
});

watch(() => props.option.url, () => {
  if (instance.value && props.option.url) {
    instance.value.switchUrl(props.option.url);
  } else {
    initPlayer();
  }
});

onBeforeUnmount(() => {
  if (instance.value && instance.value.destroy) {
    instance.value.destroy(false);
  }
});
</script>

<style scoped>
.artplayer-app {
  width: 100%;
  height: 100%;
}
</style>
