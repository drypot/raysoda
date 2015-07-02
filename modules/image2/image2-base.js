 
 /* TODO

public class BoxPhotoContext {
    public const char FuncRec = 'R'; // 사진가 추천 폴더
    public const char FuncPrimary = 'S'; // by Shooting
    public const char FuncSecondary = 'C'; // by Concept

    public const char FuncPhoto = 'P'; // by Photo

    public const char FuncPhotoFav = 'F'; // 최근 등록된 즐겨찾는 사진가들의 사진
    public const char FuncPhotoLast = 'L'; // 최근 등록된 전체 사진

    public char Function;
    public int PhotoID;
    public int FolderID;
    public string Sort;
    public char SortKey;
    public char SortDir;
    public int PageCount;
    public int PageNumber;
    public string SearchString;
    public char ViewMode;
    public Bah.Web.Http.UrlMaker UrlMaker;
        
    public WebSite.Page Page;

    public BoxPhotoFolder Folder;

    public BoxPhotoContext(WebSite.Page page) {
      this.Page = page;
      
      Function = Page.SafeQueryChar("f",'S');
      FolderID = Page.SafeQueryInt32("l", 0);
      Sort = Page.SafeQueryString("s", "VD"); / * C:CDate, U:UDate, T:Title, V:SortValue   D:Desc,A:ASC * /
      SortKey = Sort[0];
      SortDir = Sort[1];

      PageNumber = Page.SafeQueryInt32("pg", 0);
      ViewMode = Page.SafeQueryString("v","T")[0]; / * T:Thumbnail, N:Normal * /
      
      SearchString = Page.SafeQueryString("ss", "");

      PhotoID = Page.SafeQueryInt32("p", 0);
      
      UrlMaker = Page.LPContext.UrlMaker.Clone();

      UrlMaker.AddParam("f", Function);

      / *
      if (searchString.Length > 0) {
        LPContext.UrlMaker.AddParam("ss", searchString);
      }
      * /

      if (FolderID > 0) UrlMaker.AddParam("l", FolderID);
      if (PageNumber > 0) UrlMaker.AddParam("pg", PageNumber);
      if (ViewMode != 'T') UrlMaker.AddParam("v", ViewMode);
      if (Sort != "CD") UrlMaker.AddParam("s", Sort);
    }

    public void ReadFolder(SqlConnection conn) {
      Page.Assert(FolderID > 0);
      if (Folder == null) {
        Folder = new BoxPhotoFolder();
        Folder.Read(Page, conn, FolderID);
      }
    }

    public void SaveAttachFiles(int userID, SqlConnection conn) {
      BDSManager dsm = new BDSManager(userID, conn, "P", PhotoID);
      BDSManager dsmt = new BDSManager(userID, conn, "T", 0);
      dsm.SaveFiles(true);
      dsmt.MakeThumbnail(dsm.GetFiles()[0], PhotoID, 140);
    } 

    public void MakeCategoryCBList(SqlConnection conn, Control panel) {
      SqlCommand cmd;
      SqlDataReader reader;
      int high = 0, prevHigh = 0;
      int cid = 0;

      cmd = new SqlCommand("BoxFolderSelectConcepts",conn);
      cmd.CommandType = CommandType.StoredProcedure;
      cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = Page.OwnerID;
      reader = cmd.ExecuteReader();
      while (reader.Read()) {
        CheckBox cb = new CheckBox();
        cb.Text = (string)reader["Title"];
        cb.ID = reader["FolderID"].ToString();
        panel.Controls.Add(cb);
        //panel.Controls.Add(new LiteralControl("<br>"));
      }
      reader.Close();
    }

    public void InsertCategory(SqlConnection conn, Control panel) {
      SqlCommand cmd = new SqlCommand("BoxPhotoLinkFolder", conn);
      cmd.CommandType = CommandType.StoredProcedure;
      cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value = PhotoID;
      cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = Page.OwnerID;
      cmd.Parameters.Add("@FolderID", SqlDbType.Int);
      cmd.Parameters.Add("@Checked", SqlDbType.Char,1);
      CheckBox cb;
      foreach (Control c in panel.Controls) {
        cb = c as CheckBox;
        if (cb != null) {
          cmd.Parameters["@FolderID"].Value = Int32.Parse(cb.ID);
          cmd.Parameters["@Checked"].Value = cb.Checked ? 'Y' : 'N';
          cmd.ExecuteNonQuery();
        }
      }
    }

    public void RedirectToPhotoList() {
      switch (Function) {
        case FuncPhoto:
        case FuncPhotoFav:
          UrlMaker.Redirect("PList.aspx");
          break;
        default:
          UrlMaker.Redirect("FView.aspx");
          break;
      }
    }

    public static string GetPhotoListScript(string viewUrl, int ownerID, SqlDataReader reader) {
      ScriptBuilder script = new ScriptBuilder(3072);

      script.ScriptBegin();
      script.FuncBegin("phtLBegin").Param(viewUrl).FuncEnd();
      while(reader.Read()) {
        script.FuncBegin("bpPL");
        script.Param((int)reader["PhotoID"]);
        script.ParamEscaped((string)reader["Title"]);
        script.Param((int)reader["Hit"]);
        script.Param((int)reader["RepCnt"]);
        script.Param(((DateTime)reader["Date"]).ToString("yyyy-MM-dd HH:mm"));
        script.Param(ownerID);
        script.Param(reader["Music"].ToString()[0] == 'Y');
        script.FuncEnd();
      }
      script.Func("phtLEnd");
      script.ScriptEnd();

      return script.ToString();
    }
  }


WebSite.Page

protected override void OnInitPrepare() {
      char f = SafeQueryChar("f", 'S');
      switch (f) {
        case BoxPhotoContext.FuncRec :
          LPContext.LogicalPath = "/App/Box/BoxPhoto/R/";
          break;
        case BoxPhotoContext.FuncPrimary :
          LPContext.LogicalPath = "/App/Box/BoxPhoto/S/";
          break;
        case BoxPhotoContext.FuncSecondary :
          LPContext.LogicalPath = "/App/Box/BoxPhoto/C/";
          break;
        case BoxPhotoContext.FuncPhoto :
          LPContext.LogicalPath = "/App/Box/BoxPhoto/P/";
          break;
        case BoxPhotoContext.FuncPhotoFav :
          LPContext.LogicalPath = "/App/Box/Link/FavBP/";
          break;
        case BoxPhotoContext.FuncPhotoLast :
          LPContext.LogicalPath = "/App/BoxPhoto/L/";
          break;
        default :
          this.AssertFailed("Invalid Function");
          break;
      }
 */