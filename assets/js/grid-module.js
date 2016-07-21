// <grid-screen resource= "data.json">
// 	<gridid-columns>
// 		<gridid-column title="product" field="product"></gridid-column>
// 		<gridid-column title="product" field="product"></gridid-column>
// 		<gridid-column title="product" field="product"></gridid-column>
// 	</gridid-columns>
// 	<grid with-inline-editor></grid>
// </grid-screen>
var app = angular.module('gridDemo',[]);
app.directive('gridScreen',function($http){
	return{
		restrict: 'E',
		controller: function($scope){
			this.setEditor =function(editor){
				$scope.cols.unshift(editor);
			};
			this.setColumn = function(cols){
				$scope.cols = cols;
			}
		},
		link: function(scope,ele,attr){
			$http.get(attr.resource).success(function(res){
				scope.rows = res.data;
				scope.$broadcast('ready-to-render',scope.rows, scope.cols);
			})
		}
	};
});
app.directive('grididColumns',function(){
	return{
		restrict: 'E',
		require: ['^gridScreen','grididColumns'],
		controller: function($scope){
			var columns = [];
			this.addColumns =function(col){
				columns.push(col)
			};
			this.getColumns = function(){
				return columns;
			};
		},
		link: function(scope,ele,attr,controllers){
			var gridScreenCtrl = controllers[0];
			var grididColumnsCtrl = controllers[1];
			gridScreenCtrl.setColumn(grididColumnsCtrl.getColumns());
		}
	};
});
app.directive('grididColumn',function(){
	return{
		restrict: 'E',
		require: '^grididColumns',
		link: function(scope,ele,attr,grididColumnsCtrl){
			grididColumnsCtrl.addColumns({
				title: attr.title,
				field: attr.field
			});
			console.log('gridColumn',attr.title)
		}
	};
});
app.directive('grid',function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/a_table.html',
		replace: true,
		controller: function($scope){
			$scope.$on('ready-to-render',function(e,rows,cols){
				$scope.rows = rows;
				$scope.cols = cols;
			});
		}
	};
});
app.directive('withInlineEditor',function(){
	return{
		restrict: 'A',
		require: '^gridScreen',
		link: function(scope,ele,attr,gridScreenCtrl){
			gridScreenCtrl.setEditor({
				title: 'Edit',
				field: ''
			});
			console.log('withInlineEditor')
		}
	};
});
app.directive('editorInitializor',function(){
	return{
		restrict: 'E',
		require: '^gridScreen',
		templateUrl: '/templates/editor-initializor.html',
		link: function(scope,ele,attr,gridScreenCtrl){
			gridScreenCtrl.setEditor({
				title: 'Edit',
				field: ''
			});
		}
	};
}).directive('transcludeDirective', function() {
  return {
    transclude: 'element',
    scope: {},
    restrict: 'AE',
    replace: true,
    link: function(scope, elem, attrs, ctrl, transclude) {
      transclude(function(clone) { //'clone' is the clone of the directive element
        clone.css('background-color', 'yellow');
        elem.after(clone); //append the clone 
      });
    },
    template: '<div ng-transclude></div>'
  }
}).directive("foo", function() {
  return {
    transclude: 'true',
    compile: function(tElement, tAttrs) {
      var parentElement = tElement.parent();
      return function(scope, element, attrs, ctrl, transclude) {
        transclude(function(clone) {
          parentElement.append(clone);
        });
        
      };
    }
  };
})