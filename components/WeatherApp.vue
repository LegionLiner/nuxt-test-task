<template>
    <div class="main">
        <WeatherPanel @error="showError" />

        <ErrorModal :text="errorText"/>
    </div>
</template>

<script lang="ts" setup>
const errorText = ref('');

function showError(text: string) {
    errorText.value = text;
}

</script>

<style scoped>
.main {
    display: flex;
    width: 100%;
    height: 98dvh;
    justify-content: center;
    align-items: center;
}
</style>