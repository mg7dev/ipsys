<template>
  <div class="home mt-3">
    <b-row>
      <b-col cols="12">
        <div class="welcome-message">
          <p class="lead">{{ $t('welcome-message') }}</p>
        </div>
      </b-col>
      <b-col cols="12" lg="9">
        <b-row>
          <b-col
            v-for="(action, i) in actions"
            :key="i"
            sm="4"
            class="mb-3 mb-sm-0"
          >
            <div class="action shadow">
              <div class="action-icon">
                <b-icon :icon="action.icon" />
              </div>
              <div class="action-title">
                <h3 class="mb-0">{{ $t(action.title) }}</h3>
              </div>
              <div class="action-description">
                <p
                  v-for="desc in action.descriptionItems"
                  :key="`${desc}-${i}`"
                  class="mb-0"
                >
                  {{ $t(desc) }}
                </p>
              </div>
            </div>
          </b-col>
        </b-row>

        <!-- Register now  -->
        <b-row class="mb-3">
          <b-col cols="12">
            <div class="register-now shadow mt-5">
              <p class="mb-0 lead">{{ $t('register-message') }}</p>
              <b-button variant="primary">{{ $t('register') }}</b-button>
            </div>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="12" lg="3">
        <b-row>
          <b-col cols="12" class="mb-3">
            <Login />
          </b-col>
          <b-col cols="12">
            <ContactDetails />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'Home',
  middleware: 'guest',
  data() {
    return {
      actions: [
        {
          icon: 'truck',
          title: 'fast-delivery',
          descriptionItems: [
            'action-description-item',
            'action-description-item-2',
          ],
        },
        {
          icon: 'globe',
          title: 'online-delivery',
          descriptionItems: [
            'action-description-item',
            'action-description-item-2',
          ],
        },
        {
          icon: 'telephone',
          title: '24-7-support',
          descriptionItems: [
            'action-description-item',
            'action-description-item-2',
          ],
        },
      ],
    }
  },
  head() {
    return {
      title: this.$t('home'),
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  padding: 10px;

  .welcome-message {
    padding: 10px;
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 3px;
    background: white;

    > * {
      padding: 20px 0;
      width: 100%;
      border-bottom: 1px solid $body-bg;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .action-description {
      border: 0;
      flex-direction: column;
    }

    .action-icon {
      font-size: 65px;
      color: $primary;
    }
  }

  .register-now {
    background: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
      .btn {
        margin-top: 15px;
        width: 100%;
      }
    }
  }
}
</style>
