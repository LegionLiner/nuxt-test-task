<template>
    <div class="modal" :class="{ 'occured': occured?.length }">
        <div class="header">
            <img src="../assets/attention.svg" alt="attention">
            <img src="../assets/close.svg" style="cursor: pointer;" alt="close" @click="occured = ''"/>
        </div>
        {{ occured || text }} 
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    text: String
});

const occured = ref(props.text);
watch(() => props.text, () => {
    occured.value = props.text;
});
</script>

<style lang="scss" scoped>
.modal {
    position: absolute;
    top: 25px;
    left: -270px;
    width: 260px;
    height: 100px;
    background: rgba(255, 132, 132, 0.35);
    border: 1px solid rgba(239, 136, 136, 1);
    border-radius: 3px;
    padding: 12px 20px 12px 40px;
    font-size: 14px;
    transition: left 0.5s ease-in-out;

    &.occured {
        left: -20px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
}
</style>