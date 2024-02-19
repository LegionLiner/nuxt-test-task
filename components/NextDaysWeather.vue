<template>
    <div class="next-days">
        <div v-for="day in nextDays" class="day">
            <p><b>{{ day.date }}</b> ({{ day.minMax }})</p>
            <div class="day-info">
                <p>Ср. температура: {{ day.temperature }}°C</p>
                <p>Влажность: {{ day.humidity }}%</p>
                <p>Скорость ветра: {{ day.wind }} м/с</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const apiKey = "83772a54ae7249e7bd4162655241902";
import { type Day } from './interfaces';

const props = defineProps({
    city: String
});
const emits = defineEmits(['error']);

const nextDays = ref<Day[]>([]);
watch(() => props.city, () => {
    nextDays.value = [];
    getData();
});

async function getData() {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${props.city}&days=4`).then(res => {
        return res.ok ? res : Promise.reject(res)
    }).then(res => {
        return res.json()
    }).then(res => {
        for (let i = 1; i < 4; i++) {
            let day = [] as unknown as Day;
            day.date = res.forecast.forecastday[i].date.slice(5);
            day.temperature = res.forecast.forecastday[i].day.avgtemp_c;
            day.minMax = `${res.forecast.forecastday[i].day.mintemp_c}°C / ${res.forecast.forecastday[i].day.maxtemp_c}°C`;
            day.humidity = res.forecast.forecastday[i].day.avghumidity;
            day.wind = Math.floor(res.forecast.forecastday[i].day.maxwind_kph * 1000 / 3600);

            nextDays.value.push(day);
        }
    }).catch(err => {
        emits('error', 'Не удалось получить данные погоды на 3 дня вперед.');
    })
}
await getData();
</script>

<style lang="scss" scoped>
.next-days {
    display: flex;
    flex-direction: row;
    gap: 20px;
    height: 260px;

    .day {
        width: 200px;
        height: 200px;
        background: rgb(21, 48, 66);
        border-radius: 6px;
        padding: 20px;
        box-shadow: 0px 12px 22px 0px rgba(255, 255, 255, 0.05);
        transition: box-shadow 0.2s ease-in;

        &:hover {
            box-shadow: 0px 12px 22px 0px rgba(255, 255, 255, 0.1);
        }

        p {
            margin: 0;
        }

        .day-info {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;

            p {
                font-size: 14px;
            }
        }
    }
}
</style>