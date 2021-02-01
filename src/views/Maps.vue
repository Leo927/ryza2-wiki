<template>
    <b-container>
        <h1 class="text-center">地图</h1>
        <b-row>
            <router-link class="btn btn-outline-primary mx-auto" v-if="editMode" to="/map/">创建新地图</router-link>
        </b-row>
        <MapList></MapList>
    </b-container>
</template>

<script>
import MapList from '@/components/MapList';
import { mapState } from 'vuex';

export default {
    components:{
        MapList
    },
    computed:{
        ...mapState([
            'editMode'
        ])
    }
}
</script>