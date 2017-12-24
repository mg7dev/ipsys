<template>
  <div class="login shadow">
    <div class="header">{{ $t('contact-details') }}</div>
    <div class="socials">
      <div
        v-for="contactItem in contactItems"
        :key="contactItem.icon"
        class="social"
      >
        <b-icon :icon="contactItem.icon"></b-icon>
        <template v-if="!contactItem.href">
          <p>{{ contactItem.text }}</p>
        </template>
        <template v-else>
          <a :href="contactItem.href">{{ contactItem.text }}</a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactDetails',
  data() {
    return {
      contactItems: [
        {
          icon: 'geo-alt-fill',
          text: 'Nedre Kalbakkvei 90, 1081 OSLO',
        },
        {
          icon: 'telephone-fill',
          text: '21 08 06 20',
          href: 'tel:+4721080620',
        },
        {
          icon: 'envelope-fill',
          text: 'hei@lpgoslo.no',
          href: 'mailto:hei@lpgoslo.no',
        },
      ],
    }
  },
  methods: {
    send() {},
  },
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  background: $primary;
  border-radius: 3px;
  color: white;

  .header {
    width: 100%;
    padding: 5px 10px;
    background: $primary;
    color: white;
    border-radius: 3px 3px 0 0;
    border-bottom: 1px soldi white;
  }

  .form {
    padding: 20px;
  }

  .socials {
    .social {
      padding: 5px 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      > * {
        margin: 0px 10px;
        color: white;
        text-decoration: none;
      }

      p,
      a {
        margin: 0;
      }
    }
  }
}
</style>
