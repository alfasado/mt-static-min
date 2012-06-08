function Exception(name,message)
{if(name)
this.name=name;if(message)
this.message=message;}
Exception.prototype.setName=function(name)
{this.name=name;}
Exception.prototype.getName=function()
{return this.name;}
Exception.prototype.setMessage=function(msg)
{this.message=msg;}
Exception.prototype.getMessage=function()
{return this.message;}