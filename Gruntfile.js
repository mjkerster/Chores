module.exports = function(grunt){
	grunt.initConfig({
		sass : {
			dist: {
				files: {
					'styles/main.css' : 'styles/main.scss'
				}
			}
		},
		watch: {
  			scripts: {
    			files: ['**/*.scss'],
    			tasks: ['sass'],
    			options: {
      				interrupt: false,
    			},
  			},
  		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['sass', 'watch']);
}