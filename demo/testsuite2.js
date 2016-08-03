/*
	Require and initialise PhantomCSS module
	Paths are relative to CasperJs directory
*/

var fs = require( 'fs' );
var path = fs.absolute( fs.workingDirectory + '/phantomcss.js' );
var phantomcss = require( path );
var server = require('webserver').create();

var html = fs.read( fs.absolute( fs.workingDirectory + '/demo/coffeemachine.html' ));

// server.listen(8080,function(req,res){
// 	res.statusCode = 200;
// 	res.headers = {
// 		'Cache': 'no-cache',
// 		'Content-Type': 'text/html;charset=utf-8'
// 	};
// 	res.write(html);
// 	res.close();
// });
path2 = fs.absolute( fs.workingDirectory + '/demo' )
phantom.page.libraryPath = path2
// console.log(fs.absolute( fs.workingDirectory + '/demo' ))
console.log(phantom.page.injectJs('testPage.js'));
var loginPage = new testPage();

casper.test.begin( 'Studio visual test', function ( test ) {

	phantomcss.init( {
		rebase: casper.cli.get( "rebase" ),
		// SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
		casper: casper,
		libraryRoot: fs.absolute( fs.workingDirectory + '' ),
		screenshotRoot: fs.absolute( fs.workingDirectory + '/baseline2' ),
		failedComparisonsRoot: fs.absolute( fs.workingDirectory + '/failures2' ),
		// cleanupComparisonImages: true,
		comparisonResultRoot: fs.absolute( fs.workingDirectory + '/diffs2' ),
		addLabelToFailedImage: false,
		/*
		screenshotRoot: '/screenshots',
		failedComparisonsRoot: '/failures'
		casper: specific_instance_of_casper,
		libraryRoot: '/phantomcss',
		fileNameGetter: function overide_file_naming(){},
		onPass: function passCallback(){},
		onFail: function failCallback(){},
		onTimeout: function timeoutCallback(){},
		onComplete: function completeCallback(){},
		hideElements: '#thing.selector',
		addLabelToFailedImage: true,
		outputSettings: {
			errorColor: {
				red: 255,
				green: 255,
				blue: 0
			},
			errorType: 'movement',
			transparency: 0.3
		}*/
	} );

	// casper.on( 'remote.message', function ( msg ) {
	// 	this.echo( msg );
	// } );

	casper.on( 'error', function ( err ) {
		this.die( "PhantomJS has errored: " + err );
	} );

	casper.on( 'resource.error', function ( err ) {
		casper.log( 'Resource load error: ' + err, 'warning' );
	} );
	/*
		The test scenario
	*/

	casper.start( 'http://studio.livefyre.com/build-validator-prod-s2.fyre.co' );

	casper.viewport( 1024, 2000 );
	

	casper.then( function () {
		phantomcss.screenshot( '.fyre-login.body-container>form', '1: Login to Studio page' );
	} );

	casper.then( function () {
		casper.waitForSelector( loginPage.email,
			function success(){
				this.sendKeys('.fyre-email.fyre-first-input.fyre-input-text', 'danilu+owner10@adobe.com')
			},
			function timeout(){
				this.test.fail( 'Should see email login input' );
			})
		
	})
	casper.then( function(){
		casper.waitForSelector('.fyre-password.fyre-last-input.fyre-input-password',
			function success(){
				this.sendKeys('.fyre-password.fyre-last-input.fyre-input-password', 'livefyre1')
			},
			function timeout(){
				this.test.fail( 'Should see password input' );
			})
	})
	casper.then( function(){
		casper.waitForSelector('.lf-btn.lf-btn-primary',
			function success(){
				this.click('.lf-btn.lf-btn-primary');
			},
			function timeout(){
				this.test.fail('Should see login button')
			})
	})
	casper.then( function(){
		this.waitForSelector('.studio-landing-module.container',
			function success(){
				this.wait(5000)
				phantomcss.screenshot( '.studio-landing-module.container', '2: Studio landing page' );
			},
			function timeout(){
				this.test.fail('Should see Studio Landing page')
			})
	})
	// casper.then( function(){
	// 	this.waitForSelector('li:nth-child(2) .nav-item',
	// 		function success(){
	// 			this.click('li:nth-child(2) .nav-item')
	// 			this.waitForSelector('')
	// 		},
	// 		function timeout(){
	// 			this.test.fail('Should see Library Button')
	// 		})	
	// })
	casper.then( function(){
		this.waitForSelector('li:nth-child(3) .nav-item',
			function success(){
				this.click('li:nth-child(3) .nav-item')
				this.wait(30000)
				var iframeClipRect = casper.getElementBounds('#asset-manager');
				this.withFrame(0, function(){
					this.waitForSelector('.am-app', 
					function success(){
						phantomcss.screenshot('.am-app', '3: Streams page header')
						casper.then(function (){
							this.waitForSelector('.streams-title.col-md-6.col-xs-4',
								function success(){
									var comClipRect = casper.getElementBounds('.streams-title.col-md-6.col-xs-4');
        					comClipRect.top = comClipRect.top + iframeClipRect.top;
        					comClipRect.left = comClipRect.left + iframeClipRect.left;                             
        					phantomcss.screenshot(comClipRect, 1000, undefined,  '4: Streams title');
								},
								function timeout(){
									this.test.fail('Should see streams page title')
								})
							this.waitForSelector('.btn.btn-primary.livefyre-link',
								function success(){
									var comClipRect = casper.getElementBounds('.btn.btn-primary.livefyre-link');
        					comClipRect.top = comClipRect.top + iframeClipRect.top;
        					comClipRect.left = comClipRect.left + iframeClipRect.left;                             
        					phantomcss.screenshot(comClipRect, 1000, undefined,  '5: Create Stream button');
								},
								function timeout(){
									this.test.fail('Should see the Create Stream button')
								})
							this.waitForSelector('.form-control',
								function success(){
									var comClipRect = casper.getElementBounds('.form-control');
        					comClipRect.top = comClipRect.top + iframeClipRect.top;
        					comClipRect.left = comClipRect.left + iframeClipRect.left;                             
        					phantomcss.screenshot(comClipRect, 1000, undefined,  '6: Stream search input');
								},
								function timeout(){
									this.test.fail('Should see the stream search input')
								})
						})
					},
					function timeout(){
						this.test.fail('Should see streams page')
					})
				})
			},
			function timeout(){
				this.test.fail('Should see Streams button')
			})
	})
	casper.then( function(){
		this.waitForSelector('li:nth-child(4) .nav-item',
			function success(){
				this.click('li:nth-child(4) .nav-item')
				this.waitForSelector('.lf-row.lf-list-table-hover', 
					function success(){
						phantomcss.screenshot('#content', 10000, ".lf-row.lf-list-table-hover", '7: Apps page')
					},
					function timeout(){
						this.test.fail('Should see Apps page')
					})
			},
			function timeout(){
				this.test.fail('Should see Apps button')
			})
	})
	casper.then( function(){
		this.waitForSelector('li:nth-child(5) .nav-item',
			function success(){
				this.click('li:nth-child(5) .nav-item')
				this.waitForSelector('.module-header', 
					function success(){
						this.wait(15000)
						phantomcss.screenshot('.module-header', '8: ModQ Header')
						this.wait(15000)
						var iframeClipRect = casper.getElementBounds('.iframe:nth-child(2)');
						this.withFrame(1, function(){
							this.waitForSelector('.mod-item.summary.mod-item-livefyre', 
								function success(){
									var comClipRect = casper.getElementBounds('.content-wrapper');
		        			comClipRect.top = comClipRect.top + iframeClipRect.top;
		        			comClipRect.left = comClipRect.left + iframeClipRect.left;
		        			comClipRect.height = 200; 
		        			console.log(comClipRect.top)
		        			console.log(comClipRect.left)     
									phantomcss.screenshot(comClipRect, 10000, ".content, .details-aside, .task-count.lf-badge, .curate-count", '9: ModQ elements')
								},
								function timeout(){
									this.test.fail('Should see ModQ elements')
								})
						})
					},
					function timeout(){
						this.test.fail('Should see the ModQ header')
					})
			},
			function timeout(){
				this.test.fail('Should see ModQ button')
			})
	})
	casper.then(function (){
		this.waitForSelector('.fycon-settings-me',
			function success(){
				this.click('.fycon-settings-me')
				this.wait(5000)
				var iframeClipRect = casper.getElementBounds('#asset-manager');
				this.withFrame(0, function(){
					this.waitForSelector('.users-header.page-header',
						function success(){
							var comClipRect = casper.getElementBounds('.users-header.page-header');
        			comClipRect.top = comClipRect.top + iframeClipRect.top;
        			comClipRect.left = comClipRect.left + iframeClipRect.left;    
							phantomcss.screenshot(comClipRect, 2000, undefined, '10: User page header elements')
						},
						function fail(){
							this.test.fail('Should see users page header')
						})
					this.waitForSelector('.toggle-filter-btn.pull-right.btn.btn-sm.btn-default', 
						function success(){
							this.click('.toggle-filter-btn.pull-right.btn.btn-sm.btn-default')
							this.waitUntilVisible('.filter-form', 
								function success(){
									var comClipRect = casper.getElementBounds('.filter-form');
		        			comClipRect.top = comClipRect.top + iframeClipRect.top;
		        			comClipRect.left = comClipRect.left + iframeClipRect.left;    
									phantomcss.screenshot(comClipRect, 2000, undefined, '11: User page filter elements')
								},
								function fail(){
									this.test.fail('Should see users filter options')
								}, 10000)
						},
						function fail(){
							this.test.fail('Should see users page show filter button')
						})
				})
			},
			function timeout(){
				this.test.fail('Should see ModQ button')
			})
	})
	casper.then( function now_check_the_screenshots() {
		// compare screenshots
		phantomcss.compareAll();
	} );

	/*
	Casper runs tests
	*/
	casper.run( function () {
		console.log( '\nTHE END.' );
		// phantomcss.getExitStatus() // pass or fail?
		casper.test.done();
	} );
} );
