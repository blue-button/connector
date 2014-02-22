module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      endpoint: "public"
    },
    stylus: {
      compile: {
        options: {compress: false},
        files: {
            'src/css/bbhub.css': 'src/stylus/bbhub.styl'
          }
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [
          {expand: true, cwd: 'src/jade', src: '*.jade', dest: '<%=meta.endpoint%>/', ext: '.html'}
        ]
      }
    },
    concat: {
      js: {
        options: {
          separator: ';'
        },
        src: ['src/js/respond.js', 'src/js/bootstrap.min.js', 'src/js/jquery.cookie.js', 'src/js/smoothscroll.min.js', 'src/js/list.min.js', 'src/js/bbhub.js'],
        dest: '<%=meta.endpoint%>/js/bbhub-combined.js',
        nonull: true
      },
      css: {
        src: ['src/css/bootstrap.min.css', 'src/css/bbhub.css'],
        dest: '<%=meta.endpoint%>/css/bbhub-combined.css',
        nonull: true
      }

    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        // banner: '/*! Blue Button Hub <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/js/bbhub-combined.min.js': ['<%= concat.js.dest %>']
        }
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
        files: ['src/stylus/*.styl'],
        tasks: ['stylus:compile', 'concat:css'],
        options: {
          interrupt: true
        }
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['concat:js', 'uglify'],
        options: {
          interrupt: true
        }
      }
    },
    clean: {
      options: {
        'force': true
      },
      dist: ["../gh-pages/*"]
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'public/', src: ['**'], dest: '../gh-pages'},
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('dist', ['jade', 'stylus', 'concat', 'uglify', 'clean', 'copy']);
  grunt.registerTask('default', ['jade', 'stylus', 'concat', 'uglify']);

};
