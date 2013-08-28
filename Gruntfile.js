module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      endpoint: "public"
    },
    stylus: {
      bbhub: {
        options: {compress: false},
        files: {'<%=meta.endpoint%>/css/bbhub.css': 'stylus/bbhub.styl',
           '<%=meta.endpoint%>/css/styleguide.css': 'stylus/styleguide.styl'
          }
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [
          {expand: true, cwd: 'jade', src: '*.jade', dest: 'public/', ext: '.html'}
        ]
      }
    },
    watch: {
      html: {
        files: '**/*.jade',
        tasks: ['jade'],
        options: {
          interrupt: true
        }
      },
      css: {
        files: ['stylus/*.styl'],
        tasks: ['stylus:bbhub'],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jade', 'stylus']);

};
