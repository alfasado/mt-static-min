Language.syntax.unshift({input:/(\$)&gt;/g,output:'<u>$1</u>&gt;'});Language.syntax.unshift({input:/&lt;(\/?\$?MT:?\w*)/ig,output:'&lt;<u>$1</u>'});