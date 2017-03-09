module.exports = function(grunt) {
  targets = ['dev', 'test', 'stage', 'prod'];
  // If we are not passing any grunt option default option would be dev
  let target = grunt.option('target') ? grunt.option('target') : 'dev';
  if(targets.indexOf(target) <= -1 ){
    grunt.log.writeln('----------------------------------------------------------');
    grunt.log.writeln("Environment selection was unknown, you can choose dev/test/stage/prod");
    target = 'dev';
    grunt.log.writeln('----------------------------------------------------------');
    grunt.log.writeln("hence, selecting ** dev ** as default environment");
    grunt.log.writeln('----------------------------------------------------------');
  }
  else{
    grunt.log.writeln('----------------------------------------------------------');
    grunt.log.writeln("You have Selected ** "+target + " ** Environment");
    grunt.log.writeln('----------------------------------------------------------');
  }
  grunt.initConfig({
    env:target,
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main:{
        files: [
        {
          expand: true,
          cwd: 'application/config/<%= env %>/',
          src: ['config.json'],
          dest: 'application/dist/',
          filter: 'isFile'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', ['copy']);
};
