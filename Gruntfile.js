module.exports = function(grunt) {
    grunt.initConfig({
        // Minify the JS
        uglify: {
            my_target: {
                files: {
                    "dist/rangeslider/rangeslider.min.js": [
                        "src/*.js"
                    ]
                }
            }
        },

        // Minify the CSS
        cssmin: {
            my_target: {
                files: [{
                    expand:true,
                    cwd:"src",
                    src:["*.css"],
                    dest:"dist/rangeslider/",
                    ext:".min.css"
                }]
            }
        },

        shell: {
            deploy: {
                command: "git subtree push --prefix dist origin gh-pages"
            }
        }
    });

    // Import required tasks
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-shell");

    // Set default task to do everything
    grunt.registerTask("default", ["uglify", "cssmin"]);
    grunt.registerTask("deploy", ["uglify", "cssmin", "shell"]);
};
