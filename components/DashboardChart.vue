<script lang="ts" setup>
import moment from 'moment';
import { Doughnut } from 'vue-chartjs';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  ArcElement,
);

const config = useRuntimeConfig();
const startDate = ref<string | null>('');
const endDate = ref<string | null>('');

const { data, refresh } = await useFetch<any>(
  () =>
    `dashboard/${
      startDate.value && endDate.value ? 'date-range-counters' : 'counters'
    }?startDate=${startDate.value}&endDate=${endDate.value}`,
  {
    baseURL: config.public.API_BASE_URL,
  },
);

const chartOptions = ref({
  responsive: true,
  cutout: 130,
});

const setDate = (dateStr: string[] | null) => {
  if (!dateStr) {
    startDate.value = '';
    endDate.value = '';
  } else {
    startDate.value = dateStr[0] ? moment(dateStr[0]).format('YYYY-MM-DD') : '';
    endDate.value = dateStr[1] ? moment(dateStr[1]).format('YYYY-MM-DD') : '';
  }

  refresh();
};
</script>

<template>
  <div
    class="lg:w-[64%] w-full lg:mb-0 md:mb-10 bg-white small-shadow rounded-[4px] w-full py-4 px-6"
  >
    <div class="flex justify-between items-center">
      <h5 class="text-stone">Messages</h5>
      <DatePicker @setDate="setDate"></DatePicker>
    </div>
    <div px-8>
      <div class="flex flex-col justify-between items-center gap-10">
        <div class="relative w-[400px] h-[400px] my-8">
          <Doughnut
            id="dashboardChart"
            :options="chartOptions"
            :data="{
              labels: ['Emails', 'SMS', 'Voice', 'Alerts', 'Library'],
              datasets: [
                {
                  data: [
                    data.emailCount,
                    data.smsCount,
                    data.voiceCount,
                    data.messageCount,
                  ],
                  backgroundColor: [
                    '#960E0E',
                    '#B42424',
                    '#D27C7C',
                    '#7F211B',
                    '#000000',
                    '#B42425',
                  ],
                  borderWidth: 0,
                },
              ],
            }"
          />
          <div
            class="absolute flex items-center top-[14.2rem] left-1/2 w-[12rem] h-[12rem] transform -translate-x-1/2 -translate-y-1/2 rounded-full p-10 shadow-[0_3.20559px_32.0559px_rgba(0,0,0,0.08)]"
          >
            <div flex flex-col items-center>
              <p text-silver mb-3>Total Messages</p>
              <h1>
                {{
                  data.emailCount +
                  data.smsCount +
                  data.voiceCount +
                  data.messageCount
                }}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div
        class="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1 content-around gap-10 md:mb-0 mb-10"
      >
        <div class="mb-8 flex flex-col items-center md:items-start">
          <div class="flex items-center gap-2 mb-2">
            <img src="/messages.png" alt="" class="h-8" />
          </div>
          <div class="flex items-center mb-2">
            <h4 class="text-carbon mr-2">{{ data.smsCount }}</h4>
          </div>
          <div class="flex items-center gap-2">
            <img src="/sms-bullet.png" alt="" />
            <span class="text-silver">Sms</span>
          </div>
        </div>
        <div class="mb-8 flex flex-col items-center md:items-start">
          <div class="flex items-center gap-2 mb-2">
            <img src="/SentEmails.png" alt="" class="h-8" />
          </div>
          <div class="flex items-center mb-2">
            <h4 class="text-carbon mr-2">{{ data.emailCount }}</h4>
          </div>
          <div class="flex items-center gap-2">
            <img src="/email-bullet.png" alt="" />
            <span class="text-silver">Emails</span>
          </div>
        </div>
        <div class="mb-8 flex flex-col items-center md:items-start">
          <div class="flex items-center gap-2 mb-2">
            <img src="/alerts.png" alt="" class="h-8" />
          </div>
          <div class="flex items-center mb-2">
            <h4 class="text-carbon mr-2">{{ data.messageCount }}</h4>
          </div>
          <div class="flex items-center gap-2">
            <img src="/alert-bullet.png" alt="" />
            <span class="text-silver">Alerts</span>
          </div>
        </div>
        <div class="mb-8 flex flex-col items-center md:items-start">
          <div class="flex items-center gap-2 mb-2">
            <img src="/SentVoice.png" alt="" class="h-8" />
          </div>
          <div class="flex items-center mb-2">
            <h4 class="text-carbon mr-2">{{ data.voiceCount }}</h4>
          </div>
          <div class="flex items-center gap-2">
            <img src="/voice-bullet.png" alt="" />
            <span class="text-silver">Voice</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>