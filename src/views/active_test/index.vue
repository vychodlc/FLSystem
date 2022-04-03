<template>
  <div>
    <el-container style="z-index: 10" class="container">
      <el-aside>
        <el-menu
          :default-active="this.$route.path" 
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="/home/active_test/commit"><i class="el-icon-menu"></i>测试任务下发</el-menu-item>
          <el-menu-item index="/home/active_test/result"><i class="el-icon-menu"></i>测量结果</el-menu-item>
          <el-menu-item index="/home/active_test/form"><i class="el-icon-menu"></i>报表统计</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="background-color: #fff;">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default ({
  name: '',
  data() {
    return {

    };
  },
});
</script>
<style scoped>
  .el-menu {
    height: calc(100vh - 60px);
  }
</style>