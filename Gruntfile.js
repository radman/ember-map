module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          ".tmp/app/init.js": "app/init.coffee",
          ".tmp/app/register.js": "app/register.coffee",
          ".tmp/app/scripts/components/ember-map-component.js": "app/scripts/components/ember-map-component.coffee"
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd h:M:s") %> */\n'
      },
      build: {
        src:  ['.tmp/app/init.js', '.tmp/app/scripts/components/ember-map-component.js', '.tmp/app/register.js'], //<%= pkg.name %>
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    clean: ['.tmp']
  });

  // Load the plugins that provides the tasks above:
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  // Default task(s). (The one that is ran when 'grunt' command is called from the directory)
  grunt.registerTask('default', ['coffee', 'uglify', 'clean']);
};
