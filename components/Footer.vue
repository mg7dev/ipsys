<template>
  <div
    :class="`footer mt-5 ${isFloated ? 'pushed' : ''} ${
      isHidden ? 'd-none' : ''
    }`"
  >
    <b-container>
      <p>{{ $t('cookie-consent') }}</p>
      <div class="footer-flex">
        <p>LPG Oslo &copy; {{ $t('all-rights-reserved') }}</p>
        <!-- <div class="social-icons">
          <a href="#" class="fab fa-facebook"></a>
          <a href="#" class="fab fa-twitter"></a>
          <a href="#" class="fab fa-linkedin"></a>
        </div>-->
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      isFloated: false,
      isHidden: false,
      interval: null,
    }
  },
  mounted() {
    this.resized()
    this.interval = setInterval(() => this.resized(), 100)
    document.querySelector('.footer').style.display = 'flex'
    window.onresize = this.resized
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    resized() {
      this.isFloated = false
      this.isFloated = document.body.scrollHeight < window.innerHeight
    },
  },
}
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  background: $primary;
  color: white;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 135px;
  display: none;

  &.pushed {
    position: fixed;
    bottom: 0;
    left: 0;
  }

  p {
    font-size: 13px;
  }

  .footer-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .social-icons a {
    color: white !important;
    font-size: 20px;
    margin: 0 5px;
  }
}
</style>
