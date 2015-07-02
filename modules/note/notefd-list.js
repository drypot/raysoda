/* TODO

public class FView : WebSite.UserControl 
  {
    protected WebSite.PageList.DefPageList PageList;
    protected System.Web.UI.WebControls.RadioButtonList SortList;
    protected System.Web.UI.WebControls.TextBox SearchTB;
    protected System.Web.UI.WebControls.LinkButton SearchLink;
    protected System.Web.UI.HtmlControls.HtmlGenericControl SingleViewPanel;
    protected System.Web.UI.HtmlControls.HtmlAnchor FListLink;
    protected System.Web.UI.HtmlControls.HtmlAnchor AddFolderLink;
    protected System.Web.UI.HtmlControls.HtmlAnchor FEditLink;
    protected System.Web.UI.HtmlControls.HtmlAnchor NewArticleLink;
    protected System.Web.UI.HtmlControls.HtmlGenericControl NewArticleDim;
    protected System.Web.UI.HtmlControls.HtmlGenericControl SearchHolder;

    public string SingleViewScript;
    public string MultiViewScript;
    private NoteContext nc;

    private void Page_Load(object sender, System.EventArgs e) {
      Page.SetNoteContext();
      nc = Page.NoteContext;
    }

    private void SetSingleViewScript(SqlConnection conn) {
      SqlCommand cmd = null;
      SqlDataReader reader;

      ScriptBuilder script = new ScriptBuilder(8192);
      Bah.Web.Http.UrlMaker um = nc.UrlMaker;
        
      script.ScriptBegin();
      script.Func("bbsFLB");
      script.FuncBegin("bbsFLSFB").ParamEscaped(nc.IsRealFolder ? nc.Folder.Title : Page.LPContext.CurrentNode.Desc).FuncEnd();
      script.FuncBegin("bbsTLB").Param(um.GetUrl("View.aspx")).FuncEnd();

      switch (nc.Function) {
        case NoteContext.FuncPublic :
        case NoteContext.FuncBox :
          Page.Assert(nc.FolderID > 0);
          cmd = new SqlCommand("BBSSelectThreadListByFolder", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = nc.FolderID;
          cmd.Parameters.Add("@Search", SqlDbType.NVarChar, 64).Value = nc.SearchString;
          cmd.Parameters.Add("@SortKey", SqlDbType.Char, 1).Value = nc.SortKey;
          cmd.Parameters.Add("@SortDir", SqlDbType.Char, 1).Value = nc.SortDir;
          break;

        case NoteContext.FuncLinked :
          cmd = new SqlCommand("BBSSelectThreadListUser", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = Page.OwnerID;
          cmd.Parameters.Add("@Search", SqlDbType.NVarChar, 64).Value = nc.SearchString;
          break;

        / *
        case 'X':
          cmd = new SqlCommand("BBSSelectThreadListX", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          //cmd.Parameters.Add("@Search", SqlDbType.NVarChar, 64).Value = Page.SearchString;
          //cmd.Parameters.Add("@SortKey", SqlDbType.Char, 1).Value = Page.SortKey;
          //cmd.Parameters.Add("@SortDir", SqlDbType.Char, 1).Value = Page.SortDir;
          break;
        * /
      }
      //cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = 24;
      cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = nc.PageNumber;
      cmd.Parameters.Add("@PageCount", SqlDbType.Int).Direction = ParameterDirection.Output;
      reader = cmd.ExecuteReader();
      while(reader.Read()) {
        script.FuncBegin("bbsTLI");
        script.Param((int)reader["UserID"]);
        script.Param(WebSite.UserManager.GetUser((int)reader["UserID"]).Name);
        script.Param((int)reader["ThreadID"]);
        script.ParamEscaped((string)reader["Title"]);
        script.Param((int)reader["RepCnt"]);
        script.Param(((string)reader["Hidden"])[0] == 'Y');
        script.Param((int)reader["Hit"]);
        script.Param(((DateTime)reader["Date"]).ToString("yyyy-MM-dd HH:mm"));
        script.FuncEnd();
      }
      reader.Close();
      PageList.PageUrl = um.Clone().AddParam("pg",null).GetUrl("View.aspx");
      PageList.PageCount = (int)cmd.Parameters["@PageCount"].Value;
      PageList.PageNumber = nc.PageNumber;

      script.Func("bbsTLE");
      script.Func("bbsFLSFE");
      script.Func("bbsFLE");
      script.ScriptEnd();

      SingleViewScript = script.ToString();
    }

    private void SetMultiViewScript(SqlConnection conn) {
      SqlCommand cmd = null;
      SqlDataReader reader;

      ScriptBuilder script = new ScriptBuilder(8192);
      Bah.Web.Http.UrlMaker um = nc.UrlMaker;

      script.ScriptBegin();
      script.Func("bbsFLB");

      cmd = new SqlCommand("BBSFolderSelectList", conn);
      cmd.CommandType = CommandType.StoredProcedure;
      cmd.Parameters.Add("@IncPhoto", SqlDbType.Char,1).Value = "Y";
      cmd.Parameters.Add("@IncDisGuestNew", SqlDbType.Char,1).Value = "Y";
      switch (nc.Function) {
        case NoteContext.FuncPublic :
          cmd.Parameters.Add("@OwnerType", SqlDbType.Char,1).Value = Folder.OwnerTypePublic;
          cmd.Parameters.Add("@OwnerID", SqlDbType.Int).Value = 0;
          cmd.Parameters.Add("@IncHidden", SqlDbType.Char,1).Value = Page.IsBBSAdmin ? "Y" : "N";
          break;
        case NoteContext.FuncBox:
          cmd.Parameters.Add("@OwnerType", SqlDbType.Char,1).Value = Folder.OwnerTypeBox;
          cmd.Parameters.Add("@OwnerID", SqlDbType.Int).Value = Page.OwnerID;
          cmd.Parameters.Add("@IncHidden", SqlDbType.Char,1).Value = Page.IsOwner || Page.IsBBSAdmin ? "Y" : "N";
          break;
        default :
          Page.AssertFailed();
          break;
      }

      reader = cmd.ExecuteReader();

      int[] folderArray = new int[20];
      string[] titleArray = new string[20];
      bool[] hiddenArray = new bool[20]; 
      int i = 0, arrayLen;

      while(reader.Read()) {
        folderArray[i] = (int)reader["FolderID"];
        titleArray[i] = (string)reader["Title"];
        hiddenArray[i] = ((string)reader["Hidden"])[0] == 'Y';
        i++;
      }
      arrayLen = i;

      reader.Close();


      cmd = new SqlCommand("BBSFolderSelectSample", conn);
      cmd.CommandType = CommandType.StoredProcedure;
      cmd.Parameters.Add("@FolderID", SqlDbType.Int);
      string folderUrl = um.GetUrl("/Com/Note/View.aspx");
      for (i = 0; i < arrayLen; i++) {
        cmd.Parameters["@FolderID"].Value = folderArray[i];
        
        script.FuncBegin("bbsFLFB");
        script.Param(folderUrl);
                script.Param(folderArray[i]);
        script.ParamEscaped(titleArray[i]);
        script.Param(hiddenArray[i]);
        script.FuncEnd();

        script.Func("bbsTLB");

        reader = cmd.ExecuteReader();
        while (reader.Read()) {
          script.FuncBegin("bbsTLI");
          script.Param((int)reader["UserID"]);
          script.Param(WebSite.UserManager.GetUser((int)reader["UserID"]).Name);
          script.Param((int)reader["ThreadID"]);
          script.ParamEscaped((string)reader["Title"]);
          script.Param((int)reader["RepCnt"]);
          script.Param(((string)reader["Hidden"])[0] == 'Y');
          script.Param((int)reader["Hit"]);
          script.Param(((DateTime)reader["UDate"]).ToString("yyyy-MM-dd HH:mm"));
          script.FuncEnd();
        }
        reader.Close();
        script.Func("bbsTLE");
        script.Func("bbsFLFE");
      }

      if (/*nc.IsBoxSummary && */ Page.IsOwner) {
        cmd = new SqlCommand("BBSSelectThreadListUserSamp", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@UserID", Page.UserID);
        
        script.FuncBegin("bbsFLFB");
        //script.Param(folderUrl);
        script.Param(um.Clone().AddParam("f",NoteContext.FuncLinked).GetUrl("/Com/Note/View.aspx"));
        script.Param(0);
        script.Param("참여 글줄");
        script.Param(false);
        script.FuncEnd();
        
        script.FuncBegin("bbsTLB");
        //script.Param(um.Clone().AddParam("f",NoteContext.FuncLinked).AddParam("v","S").GetUrl("/Com/Note/View.aspx"));
        script.Param(um.Clone().GetUrl("/Com/Note/View.aspx"));
        script.FuncEnd();

        reader = cmd.ExecuteReader();
        while (reader.Read()) {
          script.FuncBegin("bbsTLI");
          script.Param((int)reader["UserID"]);
          script.Param(WebSite.UserManager.GetUser((int)reader["UserID"]).Name);
          script.Param((int)reader["ThreadID"]);
          script.ParamEscaped((string)reader["Title"]);
          script.Param((int)reader["RepCnt"]);
          script.Param(((string)reader["Hidden"])[0] == 'Y');
          script.Param((int)reader["Hit"]);
          script.Param(((DateTime)reader["Date"]).ToString("yyyy-MM-dd HH:mm"));
          script.FuncEnd();
        }
        reader.Close();
        script.Func("bbsTLE");
        script.Func("bbsFLFE");
      }

      script.Func("bbsFLE");
      script.ScriptEnd();

      MultiViewScript = script.ToString();
    }

    private void Page_PreRender(object sender, System.EventArgs e) {
      
      SqlConnection conn;

      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        Page.NoteContext.ReadFolder(conn);

        if (nc.ViewMode == 'S') {
          SetSingleViewScript(conn);
          SortList.Items.FindByValue(Page.NoteContext.Sort).Selected = true;
          SortList.Visible = true;
          SearchTB.Text = Page.NoteContext.SearchString;
          SearchHolder.Visible = true;
          if (nc.IsRealFolder) {
            FListLink.HRef = nc.GetCleanFolderListViewUrl();
            FListLink.Visible = true;
            if (nc.Folder.Photo || (nc.Folder.DisableGuestNew && !nc.IsFolderAdmin)) {
              NewArticleDim.Visible = true;
            } else {
              NewArticleLink.HRef = nc.UrlMaker.Clone().AddParam("pg",null).GetUrl("TNew.aspx");
              NewArticleLink.Visible = true;
            }
            if (nc.IsFolderAdmin) {
              FEditLink.HRef = nc.UrlMaker.GetUrl("FEdit.aspx");
              FEditLink.Visible = true;
            }
          }
        } else { // 'M'
          SetMultiViewScript(conn);
          SingleViewPanel.Visible = false;

          if (Page.IsBBSAdmin || Page.IsOwner) {
            AddFolderLink.Visible = true;
            AddFolderLink.HRef = nc.UrlMaker.GetUrl("/Com/Note/FNew.aspx");
            FEditLink.Visible = true;
            FEditLink.HRef = nc.UrlMaker.Clone().AddParam("cmd","FE").GetUrl("/Com/Note/FSel.aspx");
          }
          NewArticleLink.Visible = true;
          NewArticleLink.HRef = nc.UrlMaker.Clone().AddParam("cmd","TN").GetUrl("/Com/Note/FSel.aspx");
        }
      }
    }

    #region Web Form Designer generated code
    override protected void OnInit(EventArgs e) {
      //
      // CODEGEN: This call is required by the ASP.NET Web Form Designer.
      //
      InitializeComponent();
      base.OnInit(e);
    }
    
    ///   Required method for Designer support - do not modify
    ///   the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent() {
      this.SortList.SelectedIndexChanged += new System.EventHandler(this.SortList_SelectedIndexChanged);
      this.SearchTB.TextChanged += new System.EventHandler(this.SearchTB_OnTextChanged);
      this.Load += new System.EventHandler(this.Page_Load);
      this.PreRender += new System.EventHandler(this.Page_PreRender);

    }
    #endregion

    private void SearchTB_OnTextChanged(object sender, System.EventArgs e) {
      nc.UrlMaker.AddParam("ss", SearchTB.Text.Length > 0 ? SearchTB.Text : null).AddParam("pg", null).Redirect("View.aspx");
    }

    private void SortList_SelectedIndexChanged(object sender, System.EventArgs e) {
      nc.UrlMaker.AddParam("s", SortList.SelectedValue).AddParam("pg", null).Redirect("View.aspx");
    }

  } 


drop procedure BBSFolderSelectList 
go
create procedure BBSFolderSelectList
  @OwnerType char(1)
  ,@OwnerID int
  ,@IncPhoto char(1)
  ,@IncDisGuestNew char(1)
  ,@IncHidden char(1)
  as
  
  select FolderID, Title, HIdden
  from BBSFolders
  where 
    OwnerType = @OwnerType and 
    OwnerID = @OwnerID and 
    (@IncPhoto = 'Y' or Photo = 'N') and 
    (@IncDisGuestNew = 'Y' or DisGuestNew = 'N') and
    (@IncHidden = 'Y' or Hidden = 'N')
  order by SortValue
go

 
drop procedure BBSFolderSelectSample
go
create procedure BBSFolderSelectSample
  @FolderID int
  as

  declare @Count1 int
  declare @Count2 int
  
  select 
    @Count1 =SampleMin, 
    @Count2 = (select count(*) from BBSThreads where FolderID = @FolderID and UDate >= getdate() - SampleDay)
  from BBSFolders F
  where FolderID = @FolderID
  
  if (@Count1 < @Count2)
    select @Count1 = @Count2

  select top (@Count1)
  ThreadID, UserID, Title, Hit, UDate, Hidden, RepCnt = (select count(*) - 1 from BBSArticles where ThreadID = T.ThreadID)
  from BBSThreads T
  where FolderID = @FolderID
  order by UDate desc
go

*/
