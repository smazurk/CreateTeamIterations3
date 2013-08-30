tau.mashups
	.addDependency('tp3/mashups/topmenu')
	.addDependency('tp3/mashups/popup')
	.addDependency('tp3/mashups/context')
  	.addDependency('tau/configurator')
        .addDependency('tau/core/bus.reg')
	.addMashup(function(topmenu, popup, context, configurator,r) {

			var _teams = {  };
			var AddConcurrentTeamIterations = function() {
			
                                                                      
			this._popup = null;
			console.log('called');

			this._render = function() {
                                //console.log(_teams);                   
                                                   
				var mypopup = new popup();
				
				var $container = mypopup.$container;
				
				console.log('render');
                          	
                            	var $importercontainer = $('<div id="importcontainer"><div id="content"></div><div id = "buttons"><button id ="click">Click Me!</button></div></div>');
                        	
                          	$importercontainer.appendTo($container);
                          	
                                $("#importcontainer").wrap('<div id="con" style="position: fixed; top: 3%; left: auto; right: auto; bottom: 3%; width: 99%; overflow:auto;"></div>');
         			   
				$('#click').click(function(){
    
                                                        
           

            			    
                                    $.each(_teams, function(key,item){
                        
                          
                                        var postdata = {};
                                        console.log('use a better way for utc time');
                         
                                        postdata.StartDate = _teams[key].StartDate;
                                        enddate = new Date(_teams[key].StartDate);
                                        postdata.StartDate.setHours( postdata.StartDate.getHours()-5);
	  			        
                                        postdata.Name = _teams[key].Name + ' (' + formatDate(_teams[key].StartDate) + ') Iteration';
                                        enddate.setDate(enddate.getDate() + 14);
                                        postdata.EndDate = enddate;
                                        postdata.EndDate.setHours(postdata.EndDate.getHours()-5);
                                        postdata.Team  = {Id : key};
                                        console.log('==postdata==');
                                        console.log(postdata);
                                        
                                                                           
                                         $.ajax({ 
                                                          type: 'POST', 
                                                          url: '/api/v1/teamiterations', 
                                                          dataType: 'json',
                                                          processData: false,
                                                          async: false,
                                                          contentType: 'application/json',
                                                          data: JSON.stringify(postdata), 
                                                          success: function(){ console.log("yay!");}, 
                                                          error: function(){console.log("boo!");}
                                          }); 
                                          
                                      });     
                                      
                                      
                                      
                                      
                                      buildContent();
                                      return false;
                                
                                                                                           
                            });                                                        
           

            				
                                
                                
                                
                                buildContent();
          
                    
				return mypopup;
			};
                      
                      	/*---------------------------- */
                      	/* For getting team iterations */
                       	/*---------------------------- */
                        
                      	function getTeamIterations(handleData) {
          		var now = new Date();
          		
                        $.ajax({
                          type: 'GET',
      			  async: false,
                          //m-d-Y
                          
                          
                          
                          url: '/api/v1/TeamIterations?format=json&where=EndDate%20gte%20' + formatDate(now) + '&take=1000&orderBy=EndDate',
                          contentType: 'application/json',
                          dataType: 'json',
                          success: function(resp) {
                               handleData(resp); 
                               console.log(resp);
                          }
                                     
              		});
                        
        		};

                        /*---------------------------- */ 
                        /* For getting teams */
                        /*---------------------------- */   
   
                        function getTeams(handleData) {
 			
          		$.ajax({
                          type: 'GET',
      			  async: false,              
                          url: '/api/v1/Teams?format=json',
                          contentType: 'application/json',
                          dataType: 'json',
                          success: function(resp) {
                               handleData(resp); 
                          }
                                     
              		 });
                      
       			 };
                        
                        
                      	/*---------------------------- */ 
 			/* build the content */
                        /*---------------------------- */
                        
      			function buildContent(){
     			
                        $('#content').html('');
			//build a list of the teams, probably build from team/project selector in tp3	                              
  	
    			//var teams = { };
        		
              
	      		getTeams(function(output){
                        console.log(output);                          
                     
        		var teamitem;                
        		$.each(output.Items, function(key,item){
                                // console.log("hi");   
	            		teamitem = {
                               	     Name: item.Name,
                               	     LastEnd : null,
                               	     StartDate: null
                               	     };
                            //console.log(item);
	                       _teams[item.Id] = teamitem;
                       
			 });
	                });
			
                        
                        
                        console.log("the team iterations");
        	
        	
                        var enddate;
                      	getTeamIterations(function(output){
                          $.each(output.Items, function(key,item){
                               console.log( item );                                  
                               enddate = new Date(parseInt(item.EndDate.substr(6)));
                               console.log(enddate);           
                    	       console.log("need to offset to servertime");
			       enddate.setHours(enddate.getHours()-1);
                    
                               console.log("End Date: " + enddate);
                               _teams[item.Team.Id].LastEnd = enddate;
                          });
                        });
                      
                      	console.log("test");
 
                        
                        buildTable();
                        
        	    	};
        		
                        function formatDate(date){
	                        var datestring = "";
	                        datestring = (date.getMonth() + 1) + "-" + date.getDate() + "-" +  date.getFullYear();
                          	

                            
	                        return datestring;
                        };
                        

			function buildTable(){
                                              
                        var iterationstable = $('<BR><table width= 500></table>');
                        iterationstable.append($('<tr><th colspan = 4; width= 400 align = "left">Team Iterations</th></tr>'));
                        iterationstable.append($('<tr><th> </th><th align = "left">Team</th><th align = "left">Last End</th><th align = "left">Next Start</th></tr>'));
                    
                    
                        console.log(_teams);
                        $.each(_teams, function(key,item){
                        
                                console.log('New Team');
                                console.log(_teams[key]);
                                enddate = _teams[key].LastEnd;
                                
                                if(enddate !== null){
                                        //have our next sprint start after our current sprint
	                                startdate = new Date(enddate);
                                        enddate = formatDate(enddate);                     
                                    	console.log('StartDate: ' + startdate);
                                        startdate.setDate(startdate.getDate() + 1);
                                        //have our object remember the new start date
                                        console.log('EndDate: ' + enddate);
                                        _teams[key].StartDate = startdate;
                                        //now make it a string for display
                                        startdate =  formatDate(startdate);
                                        
                                }else{
                                        enddate = "n/a";
                                        startdate = new Date();
                                        _teams[key].StartDate = startdate;
                                        startdate =  formatDate(startdate);
                                }
                                var tr = $('<tr></tr>');
                                
                                tr.append($('<td><input type="checkbox" name="' + key + '" value="' + key + '" checked></td><td align = "left">' + _teams[key].Name + '</td><td align = "left">' + enddate  + '</td>'));
                                tr.append($('<td align = "left">' + startdate  + '</td>').click(function(){
                                        console.log('woo');
                                                     
                                }));
                  
                                iterationstable.append(tr);                              
        
                          });
                          
                          $('#content').append(iterationstable);
                          $('#content').append('<BR><BR><BR>');
                                              
                       }

                          
			this._show = function() {
				if (this._popup == null) {
					this._popup = this._render();
				}
				this._popup.show();
			};

			topmenu
				.addItem('TeamIterations')
				.onClick($.proxy(this._show, this));

			context.onChange($.proxy(function(d) {
				this._popup = null;
			}, this));
		};
			new AddConcurrentTeamIterations();
			console.log('aaaa');
                    	console.log(context);
                      	console.log(configurator);
                        console.log(r);

	});