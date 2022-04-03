<template>
  <div>
    <el-empty description="暂未开发"></el-empty>
  </div>
</template>

<script>
  export default {
    name: "Dashboard",
    data () {
    return {
      data: {},
      activeTab: 0,
    }
    },
    methods:{},
    mounted() {
    }
  }
</script>

<style scoped>
  .el-empty {
    height: calc(100vh - 200px);
  }
</style>