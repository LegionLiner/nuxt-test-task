<template>
    <div class="wrapper">
        <div class="panel">
            <div class="city-weather-today">
                <div class="input">
                    <input v-model="cityInput" ref="input">

                    <div v-if="isEditable" class="submit">
                        <button @click="getData">Поиск</button>
                    </div>
                </div>
                <div class="weather">
                    <div class="info-block" title="Температура" :class="{ 'blured': !weatherInfo.temperature }">
                        <p>Температура: {{ weatherInfo.temperature }} °C</p>
                        <p>({{ weatherInfo.minMax }})</p>
                    </div>
                    <div class="info-block" title="Влажность" :class="{ 'blured': !weatherInfo.humidity }">
                        <p>Влажность: {{ weatherInfo.humidity }} %</p>
                        <img src="../assets/drop-humidity-icon.svg" alt="влажность">
                    </div>
                    <div class="info-block" title="Ветер" :class="{ 'blured': !weatherInfo.wind }">
                        <p>Скорость ветер: {{ weatherInfo.wind }} м/с</p>
                        <img src="../assets/wind-icon.svg" alt="ветер">
                    </div>
                </div>
            </div>
            <div class="weather-icon-wrapper" :title="weatherInfo.description">
                <img :src="icon">
            </div>
        </div>
        <div class="next-days">
            <p>Погода в городе {{ weatherInfo.name }} на 3 дня вперед:</p>
            <NextDaysWeather :city="city" @error="emits('error', $event)" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { type CurrentDay } from './interfaces';

const emits = defineEmits(['error']);

const apiKey = "7ef64ca8eb156d2b3f3d62b01bf93f2d";
const input = ref<HTMLInputElement | null>(null);
const cityInput = ref('Moscow');
const city = ref('Moscow');
const weatherInfo = ref<CurrentDay | Record<string, never>>({})
const weatherIcons = {
    'clear': 'day',
    'night': 'night',
    'clouds': 'cloudy',
    'rain': 'rainy-6',
    'thunderstorm': 'thunder',
    'snow': 'snowy-6',
};
const isEditable = ref(false);
const icon = computed(() => {
    if (weatherInfo.value.status == 'clear') {
        const date = new Date(weatherInfo.value.time * 1000).getHours();

        return (date >= 6 && date < 18) ? useAsset('day') : useAsset('night');
    }
    // @ts-ignore
    return useAsset(weatherIcons[weatherInfo.value.status]);
})

async function getData() {
    await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=ru&units=metric&appid=${apiKey}`).then(res => {
        return res.ok ? res : Promise.reject(res)
    }).then(res => {
        return res.json()
    }).then(res => {
        city.value = cityInput.value;
        weatherInfo.value.name = res.name;
        weatherInfo.value.temperature = res.main.temp;
        weatherInfo.value.humidity = res.main.humidity;
        weatherInfo.value.wind = res.wind.speed;
        weatherInfo.value.minMax = `${res.main.temp_min}°C / ${res.main.temp_max}°C`;
        weatherInfo.value.status = res.weather[0].main.toLowerCase();
        weatherInfo.value.description = res.weather[0].description;
        weatherInfo.value.time = res.dt;
    }).catch(err => {
        console.debug(err);
        emits('error', "Не удалось получить данные погоды за сегодняшний день.");
    })
}
await getData();

function useAsset(path: string): string {
    if (!path) return '';
    // @ts-ignore
    const assets = import.meta.glob('~/assets/**/*', {
        eager: true,
        import: 'default',
    })

    return assets['/assets/' + path + '.svg']
}

document?.addEventListener('focusin', () => {
    isEditable.value = true;
})
document?.addEventListener('focusout', () => {
    setTimeout(() => {
        isEditable.value = false;
    }, 200)
})
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.panel {
    display: flex;
    flex-direction: row;
    gap: 40px;

    .city-weather-today {
        width: 400px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        background: rgba(21, 48, 66, 1);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0px 12px 22px 0px rgba(255, 255, 255, 0.05);
        transition: box-shadow 0.2s ease-in;

        &:hover {
            box-shadow: 0px 12px 22px 0px rgba(255, 255, 255, 0.1);
        }

        .input {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            height: 76px;

            button {
                color: rgba(122, 195, 247, 1);
                background: rgba(15, 34, 49, 1);
                border: 1px solid rgba(122, 195, 247, 1);
                border-radius: 6px;
                padding: 8px 24px;
                cursor: pointer;
                transition: all 0.2s ease-in;

                &:hover {
                    background: rgba(15, 34, 49, .5);
                }
            }

            p {
                font-size: 24px;
                font-weight: 700;
                line-height: 25.5px;
            }

            input {
                background: none;
                border: none;
                outline: none;
                font-family: PT Sans;
                color: #F5F5F5;
                font-size: 24px;
                font-weight: 700;
                width: 250px;
                margin: 24px 0;
                border-bottom: 1px solid #F5F5F5;
            }
        }

        .weather {
            display: flex;
            width: 100%;
            flex-direction: column;
            justify-content: space-between;
            padding: 10px;

            .info-block {
                display: flex;
                gap: 5px;
                align-items: center;

                img {
                    height: 17px;
                }

                &.blured {
                    filter: blur(3px);
                }
            }
        }
    }

    .weather-icon-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 200px;
        }
    }

}

.next-days {
    p {
        font-weight: 700;
        font-size: 17px;
    }
}
</style>