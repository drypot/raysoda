/* TODO

protected WebSite.PageList.DefPageList PageList;
    protected System.Web.UI.WebControls.RadioButtonList SortList;
    protected System.Web.UI.HtmlControls.HtmlAnchor FNewLink;
    //protected System.Web.UI.HtmlControls.HtmlGenericControl MsgNoData;

    //public StringBuilder rvBuf = new StringBuilder(2048);

    public string FolderListScript;

    private void Page_Load(object sender, System.EventArgs e) {
      SetBoxPhotoContext();
    }

    public static string GetScript(BoxPhotoContext ctx) {
      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      string rv = String.Empty;

      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();

        int[] folderIDs = new int[13];
        int[] folderTCs = new int[13];
        int folderCnt = 0;

        if (ctx.Function == BoxPhotoContext.FuncRec) {
          cmd = new SqlCommand("BoxFFSelectList", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = ctx.Page.OwnerID;
          reader = cmd.ExecuteReader();

          //SortList.Visible = reader.HasRows;

          while(reader.Read()) {
            folderIDs[folderCnt] = (int)reader["FolderID"];
            folderTCs[folderCnt] = (int)reader["Count"];
            folderCnt++;
          }
          reader.Close();
        } else {
          cmd = new SqlCommand("BoxFolderSelectList", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = ctx.Page.OwnerID;
          cmd.Parameters.Add("@SortKey", SqlDbType.Char, 1).Value = ctx.SortKey;
          cmd.Parameters.Add("@SortDir", SqlDbType.Char, 1).Value = ctx.SortDir;
          cmd.Parameters.Add("@Func", SqlDbType.Char, 1).Value = ctx.Function;
          cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = 10;
          cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = ctx.PageNumber;
          cmd.Parameters.Add("@PageCount", SqlDbType.Int).Direction = ParameterDirection.Output;
          cmd.Parameters.Add("@RowCount", SqlDbType.Int).Direction = ParameterDirection.Output;
          cmd.Parameters.Add("@Search", SqlDbType.NVarChar, 64).Value = ctx.SearchString;
          reader = cmd.ExecuteReader();

          //SortList.Visible = reader.HasRows;

          while(reader.Read()) {
            folderIDs[folderCnt] = (int)reader["FolderID"];
            folderTCs[folderCnt] = (int)reader["ThumbCount"];
            folderCnt++;
          }
          reader.Close();

          ctx.PageCount = (int)cmd.Parameters["@PageCount"].Value;
        }
      
        cmd = new SqlCommand("BoxFolderSelectListItem", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@FolderID", SqlDbType.Int);
        cmd.Parameters.Add("@Count", SqlDbType.Int);
    
        ScriptBuilder script = new ScriptBuilder(2048);

        script.ScriptBegin();
        script.FuncBegin("bpFLB").Param(ctx.Sort).FuncEnd();
        for (int i = 0; i < folderCnt; i++) {
          int fid = folderIDs[i];

          cmd.Parameters["@FolderID"].Value = fid;
          cmd.Parameters["@Count"].Value = folderTCs[i];
          reader = cmd.ExecuteReader();

          reader.Read();

          script.FuncBegin("bpFLFB");

          script.Param(fid);
          script.Param((string)reader["Func"]);
          script.ParamEscaped((string)reader["Title"]);
          script.Param((int)reader["PhotoCnt"]);
          script.Param((int)reader["Hit"]);
          script.Param((int)reader["RepCnt"]);
          script.Param(((DateTime)reader["Date"]).ToString("yyyy-MM-dd HH:mm"));
          script.FuncEnd();

          reader.NextResult();
          while (reader.Read()) {
            script.FuncBegin("bpFLFI");
            script.Param((int)reader["PhotoID"]);
            script.Param((int)reader["RepCnt"]);
            script.Param((int)reader["Hit"]);
            script.ParamEscaped((string)reader["Title"]);
            script.Param(((DateTime)reader["CDate"]).ToString("yyyy-MM-dd HH:mm"));
            script.FuncEnd();
          }

          script.Func("bpFLFE");

          reader.Close();
        }
        script.Func("bpFLE");
        script.ScriptEnd();

        rv = script.ToString();
      }
      return rv;
    }

    private void Page_PreRender(object sender, System.EventArgs e) {
      BoxPhotoContext ctx = BoxPhotoContext;
      FolderListScript = GetScript(ctx);

      if (ctx.Function == BoxPhotoContext.FuncRec) {
        FNewLink.Visible = false;
      } else {
        PageList.PageUrl = ctx.UrlMaker.Clone().AddParam("pg",null).GetUrl("FList.aspx");
        PageList.PageCount = ctx.PageCount;
        PageList.PageNumber = ctx.PageNumber;

        if (IsBoxAdmin) {
          FNewLink.Visible = true;
          FNewLink.HRef = ctx.UrlMaker.Clone().AddParam("pg",null).GetUrl("FNew.aspx");
        }
      }

      //SearchTB.Text = ctx.SearchString;
      //SortList.Items.FindByValue(ctx.Sort).Selected = true;

      //DataBind();
      
    }

    private void SearchTB_TextChanged(object sender, System.EventArgs e) {
      //ctx.UrlMaker.AddParam("ss", SearchTB.Text).AddParam("pg", null).Redirect("FList.aspx");
    }


procedure BoxFolderSelectList
  @UserID     int
  ,@SortKey   char(1) -- C: CDate, U: UDate, T:Title
  ,@SortDir   char(1)
  ,@Func      char(1)
  ,@PageSize    int
  ,@PageNumber  int
  ,@PageCount   int output
  ,@RowCount    int output
  ,@Search    nvarchar(64) = ''
  as

  declare @HeadSize int
  declare @TailSize int
  declare @ReturnSize int

  declare @Start int
  declare @End Int

  if (@Search = '') 
    begin
      select @RowCount = count(*)
      from BoxFolders
      where UserID = @UserID and Func = @Func
          
      select @PageCount =  (@RowCount - 1) / @PageSize + 1
      select @HeadSize = @PageSize * (@PageNumber + 1)
      select @TailSize = @RowCount - @PageSize * @PageNumber
      select @ReturnSize = case when @PageSize < @TailSize then @PageSize else @TailSize end

      if (@TailSize < 0) return;

      if (@SortKey = 'V')
        select I.FolderID, F.ThumbCount
        from (select top (@ReturnSize) FolderID, SortValue from (select top (@HeadSize) FolderID, SortValue from BoxFolders where UserID = @UserID  and Func = @Func order by SortValue desc, FolderID desc) I order by SortValue, FolderID) I join BoxFolders F on I.FolderID = F.FolderID
        order by I.SortValue desc, I.FolderID desc
      else if (@SortKey = 'U')
        select I.FolderID, F.ThumbCount
        from (select top (@ReturnSize) FolderID, UDate from (select top (@HeadSize) FolderID, UDate from BoxFolders where UserID = @UserID  and Func = @Func order by UDate desc) I order by UDate) I join BoxFolders F on I.FolderID = F.FolderID
        order by I.UDate desc
    end
go

*/