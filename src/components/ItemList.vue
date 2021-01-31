<template>
    <b-table hover :items="items"></b-table>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed:{
        ...mapState([
            'items'
        ])
    }
}
</script>