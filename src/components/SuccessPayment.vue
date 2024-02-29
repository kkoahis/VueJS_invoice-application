<template>
    <div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your payment.</p>
        <p>Session ID: {{ session_id }}</p>
        <!-- Các nội dung khác bạn muốn hiển thị -->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { onMounted } from 'vue';
import apiUrl from '../url/apiUrls.js'

const router = useRouter();

// Nhận giá trị session_id từ URL
const session_id = ref(router.currentRoute.value.query.session_id);

const sessionIdPayment = async () => {
    try {
        const response = await axios.get(apiUrl + `/success?session_id=${session_id.value}`)
        console.log(response.data.data)
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => {
    sessionIdPayment()
})
</script>
