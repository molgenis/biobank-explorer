<template>
  <div @click.stop="">
    <div
      :class="{
        'font-weight-bold': boldText,
      }"
    >
      <span v-if="label && !iconBeforeLabel">{{ label }}</span>
      <span
        class="
          fa fa-question-circle
          text-info
          position-relative
          popover-trigger-area
        "
        :class="label ? iconBeforeLabel ? 'mr-1' : 'ml-1' : ''"
        aria-hidden="true"
        :id="`qm-${uniqueId}`"
      ></span>
      <span v-if="label && iconBeforeLabel">{{ label }}</span>
    </div>
    <b-popover
      :target="`qm-${uniqueId}`"
      triggers="hover click"
      :placement="popoverPlacement"
      custom-class="info-popover"
    >
      <slot></slot>
    </b-popover>
  </div>
</template>

<script>
export default {
  name: 'InfoPopover',
  props: {
    /**
     * Wether the label is bold
     */
    boldText: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * If set the ( ? ) icon wil be shown before the label
     */
    iconBeforeLabel: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * The text to show before or after the ( ? ) icon
     */
    label: {
      type: String,
      required: false
    },
    popoverPlacement: {
      type: String,
      default: 'top'
    }
  },
  data () {
    return {
      uniqueId: Date.now() + '' + Math.random()
    }
  }
}
</script>

<style>
/* Styling to add a line around the triangle, cannot be scoped due to bootstrap */
.info-popover[x-placement^='top'] > .arrow::before {
  border-top-color: black !important;
}
.info-popover[x-placement^='top'] > .arrow::after {
  border-top-color: white !important;
}

.info-popover[x-placement^='left'] > .arrow::before {
  border-left-color: black !important;
}
.info-popover[x-placement^='left'] > .arrow::after {
  border-left-color: white !important;
}

/* Add popover overrides so that it is always clearly visible in any theme (even custom ones) */
.info-popover {
  background-color: white !important;
  border: solid black 0.5px;
  max-width: 30rem;
}

.popover-trigger-area:hover {
  cursor: pointer;
}

/* for touch screens, so you have a nice area to press and still get a popover */
.popover-trigger-area::after {
  content: '';
  position: absolute;
  top: -0.5rem;
  bottom: -1rem;
  right: -7rem;
  left: -0.5rem;
}
</style>
