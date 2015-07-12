
/* TODO
procedure UserSearch
    @NickName nvarchar(32) = null
    ,@RealName  nvarchar(32) = null
    ,@Email   nvarchar(64) = null
    as

    select top 200 NickName as Name, * 
    from users 
    where 
      (@NickName != '' and nickname like '%' + @NickName + '%') or 
      (@RealName != '' and RealName like '%' + @RealName + '%') or 
      (@Email != '' and Email like '%' + @Email + '%') 
    order by NickName
*/