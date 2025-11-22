<template>
  <div class="fui-button-hover-effect">
    <span class="button-text text-black">{{ label }}</span>
    <div class="button-circle"></div>
    <span class="button-icon">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.0909 7.26521C14.4968 6.8906 15.1294 6.9159 15.504 7.32172L18.7348 10.8217C19.0884 11.2047 19.0884 11.7952 18.7348 12.1782L15.504 15.6783C15.1294 16.0841 14.4968 16.1094 14.091 15.7348C13.6851 15.3602 13.6598 14.7276 14.0344 14.3217L15.716 12.5H6C5.44771 12.5 5 12.0523 5 11.5C5 10.9477 5.44771 10.5 6 10.5H15.716L14.0344 8.67829C13.6598 8.27247 13.6851 7.63981 14.0909 7.26521Z"
          fill="currentColor"
        />
      </svg>
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Watch Now'
  }
});
</script>

<style scoped>
.fui-button-hover-effect {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 16px 16px 16px 32px;
  background-color: white;
  color: white;
  position: relative;
  cursor: pointer;
  font-weight: 500;
  transition: linear 0.25s;
  border: 1px solid #0f172a;
  letter-spacing: 2px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.fui-button-hover-effect:hover {
  color: #0f172a;
}

.fui-button-hover-effect:hover .button-circle {
  height: 100%;
  right: 0;
  width: 100%;
}

.fui-button-hover-effect .button-text {
  z-index: 1;
}

.fui-button-hover-effect .button-circle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 45px;
  height: 45px;
  border-radius: 8px;
  background-color: #F59E0B;
  right: 8px;
  transition: linear 0.25s;
}

.fui-button-hover-effect .button-icon {
  color: #0f172a;
  z-index: 10;
  margin-left: 12px;
}

.fui-button-hover-effect .button-icon svg {
  width: 26px;
  height: 26px;
}
</style>
