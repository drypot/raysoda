
/* TODO


public class Page : WebSite.Page {
    
    protected override void OnInitPrepare() {
      switch (Request.QueryString["f"][0]) {
        case NoteContext.FuncPublic :
          LPContext.LogicalPath = "/App/Note/F/";
          break;
        case NoteContext.FuncBox :
          LPContext.LogicalPath = "/App/Box/Note/F/";
          break;
        case NoteContext.FuncLinked :
          LPContext.LogicalPath = "/App/Box/Note/U/";
          break;
        default :
          this.AssertFailed("Invalid Function");
          break;
      }
    }
    
    / *
    protected override void OnLoad(System.EventArgs e) {
      base.OnLoad(e);
    }
    * /
  }


public class Folder {

    public const char OwnerTypePublic = 'A';
    public const char OwnerTypeBox = 'B';

    public int ID;
    public WebSite.User Owner;
    public int OwnerID;
    public char OwnerType;
    public int SortValue;
    public int SampleDay;
    public int SampleMin;
    public bool Attach;
    public bool AttachOnReply;
    public bool AttachMultiple;
    public bool AttachOwnerOnly;
    public bool DisableGuestNew;
    public bool DisableGuestReply;
    public bool Hidden;
    public bool Photo;
    public string Title;

    public void Load (SqlDataReader reader) {
      ID = (int)reader["FolderID"];
      OwnerID = (int)reader["OwnerID"];
      if (OwnerID > 0) {
        Owner = UserManager.GetUser(OwnerID);
      }
      OwnerType = ((string)reader["OwnerType"])[0];
      SortValue = (int)reader["SortValue"];
      SampleDay = (int)reader["SampleDay"];
      SampleMin = (int)reader["SampleMin"];
      Attach = ((string)reader["ATTE"])[0] == 'Y';
      AttachOnReply = ((string)reader["ATTR"])[0] == 'Y';
      AttachMultiple = ((string)reader["ATTM"])[0] == 'Y';
      AttachOwnerOnly = ((string)reader["ATTO"])[0] == 'Y';
      DisableGuestNew = ((string)reader["DisGuestNew"])[0] == 'Y';
      DisableGuestReply = ((string)reader["DisGuestReply"])[0] == 'Y';
      Hidden = ((string)reader["Hidden"])[0] == 'Y';
      Photo = ((string)reader["Photo"])[0] == 'Y';
      Title = (string)reader["Title"];
    }

  }

  public class NoteContext {
    public const char FuncPublic = 'A'; // 전체 게시판
    public const char FuncBox = 'B';  // 개인 게시판
    public const char FuncLinked = 'U'; // 사용자 참여 글목록

    // 과거 A: 전체게시판, B: 갤러리게시판, U:개인게시판, D:개인일면(Dashboard), W:개인별전체, X:개인게시판전체

    public char Function;
    public Folder Folder;
    public int FolderID;
    public int ThreadID;
    public int ArticleID;
    public int PageNumber;
    public int PhotoID;
    public string Sort;
    public char SortKey;
    public char SortDir;
    public string SearchString;
    public Bah.Web.Http.UrlMaker UrlMaker;
    
    private DateTime ArticleCDate;
    public int ArticleUserID;
    
    private WebSite.Page Page; 
    
    public char ViewMode;

    public bool IsFolderOwner;
    public bool IsFolderAdmin;
    public bool IsFirstArticle;
    public bool IsArticleOwner;
    public bool IsEditable;
    public bool IsEditTimedOut;
    public bool IsContentEditable;
    public bool IsDeletable;
    public bool IsRealFolder;
    public bool IsBoxSummary;

  
    public NoteContext(WebSite.Page page) {
      this.Page = page;
      Function = Page.SafeQueryChar("f", 'X');
      UrlMaker = Page.LPContext.UrlMaker.Clone();

      if (Function != 'X') {
        IsRealFolder = Function == FuncPublic || Function == FuncBox;

        FolderID = Page.SafeQueryInt32("l", 0);
        ThreadID = Page.SafeQueryInt32("t", 0);
        ArticleID = Page.SafeQueryInt32("a", 0);
        PhotoID = Page.SafeQueryInt32("p", 0);
        PageNumber = page.SafeQueryInt32("pg", 0);
        SearchString = Page.SafeQueryString("ss", "");
        Sort = Page.SafeQueryString("s","UD");
        SortKey = Sort[0];
        SortDir = Sort[1];
        ViewMode = Page.SafeQueryChar("v",'M'); // M:Multiple Folders, S:Single Folder

      
        UrlMaker.AddParam("f", Function);
        if (FolderID > 0) UrlMaker.AddParam("l", FolderID);
        if (PageNumber > 0) UrlMaker.AddParam("pg",PageNumber);
        if (Sort != "UD") UrlMaker.AddParam("s", Sort);
        if (ViewMode != 'M') UrlMaker.AddParam("v", ViewMode);
        if (SearchString.Length > 0) UrlMaker.AddParam("ss",SearchString);

        //if (ThreadID > 0) UrlMaker.AddParam("t",ThreadID);
        //if (ArticleID > 0) UrlMaker.AddParam("a",ArticleID);
        //if (PhotoID > 0) UrlMaker.AddParam("p",PhotoID);
      } else {
        // Box Summary Mode
        Function = FuncBox;
        UrlMaker.AddParam("f", FuncBox);
        IsBoxSummary = true;
      }
    }

    public string PageTitle {
      get {
        string pageTitle = String.Empty;
        if (Folder == null) {
          pageTitle = Page.LPContext.CurrentNode.AttrString("desc");
        } else {
          pageTitle = Bah.Web.Html.Util.GetJScriptString(Folder.Title);
          switch (Function) {
            case FuncPublic :  
              break;
            case FuncBox :
            case FuncLinked :
              if (Folder.OwnerType != Folder.OwnerTypePublic) {
                pageTitle = UserManager.GetUser(Folder.OwnerID).Name + " / " + pageTitle;
              }
              break;
            / *
            case 'X' :
              pageTitle = UserManager.GetUser(Folder.UserID).Name + " / " + Folder.Title;
              break;
            * /
          }
        }
        return pageTitle;
      }
    }

    public string PageTitleLinkUrl {
      get {
        string url = String.Empty;
        if (Folder != null) {
          switch (Function) {
            case FuncPublic : 
              break;
            case FuncBox :
            case FuncLinked :
              if (Folder.OwnerType == Folder.OwnerTypePublic) {
                url = "/Com/Note/View.aspx?f=A&v=S&l=" + Folder.ID;
              } else if (Folder.ID != FolderID) {
                url = "/Com/Note/View.aspx?f=B&v=S&l=" + Folder.ID + "&u=" + Folder.OwnerID;
              }
              break;
            / *
            case 'X' :
              url = "/Com/Note/View.aspx?f=B&v=S&l=" + Folder.ID + "&u=" + Folder.UserID;
              break;
            * /
          }
        }
        return url;
      }
    }

    
    //
    //
    //    Context Setting
    //    

    private bool IsFolderRead;

    private void ReadFolderCore(SqlDataReader reader) {
      if (reader.Read()) {
        Folder = new Folder();
        Folder.Load(reader);

        IsFolderOwner = Folder.OwnerID == 0 ? Page.IsBBSAdmin : Folder.OwnerID == Page.UserID;
        IsFolderAdmin = IsFolderOwner || Page.IsBBSAdmin;

        if (Folder.Hidden && !IsFolderAdmin) {
          Page.ShowNotAllowed();
        }
        if (FolderID > 0 && FolderID != Folder.ID) {
          Page.ShowInvalidPage();
        }
      } else {
        Page.ShowInvalidPage();
      }
    }


    public void ReadFolder(SqlConnection conn) {
      if (!IsFolderRead) {
        SqlCommand cmd;
        SqlDataReader reader;
        if (ArticleID > 0) {
          cmd = new SqlCommand("BBSSelectContext", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = ThreadID;
          cmd.Parameters.Add("@ArticleID", SqlDbType.Int).Value = ArticleID;
          reader = cmd.ExecuteReader();

          ReadFolderCore(reader);

          reader.NextResult();
          if (reader.Read()) {
            ArticleCDate = (DateTime)reader["CDate"];
            ArticleUserID = (int)reader["UserID"];
          } else {
            Page.ShowInvalidPage();
          }
          reader.Close();

        } else if (ThreadID > 0) {
          cmd = new SqlCommand("BBSSelectContext", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = ThreadID;
          reader = cmd.ExecuteReader();

          ReadFolderCore(reader);

          reader.Close();

        } else if (FolderID > 0) {
          cmd = new SqlCommand("BBSSelectContext", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@FolderID", SqlDbType.Int).Value = FolderID;
          reader = cmd.ExecuteReader();

          ReadFolderCore(reader);

          reader.Close();
        }
        IsFolderRead = true;
      }
    }

    public void CheckPermForNewThread(SqlConnection conn) {
      Page.Assert(FolderID > 0);
      
      ReadFolder(conn);

      WebSite.User user = (WebSite.User)Page.User;
      / *
      if (Folder.OwnerType == Folder.OwnerTypePublic && user.CDate.CompareTo(DateTime.Now.AddDays(-3)) > 0) {
        UrlMaker.Redirect("ErrOnProbation.aspx");
      } else 
      * /
      if (user.FDisWrite) {
        UrlMaker.Redirect("ErrWriteDisabled.aspx");
      } else if (Folder.DisableGuestNew && !IsFolderAdmin) {
        Page.ShowNotAllowed();
      }
    }

    public void CheckPermForReply(SqlConnection conn) {
      Page.Assert(ThreadID > 0);
      
      ReadFolder(conn);

      WebSite.User user = (WebSite.User)Page.User;
      / *
      if (Folder.OwnerType == Folder.OwnerTypePublic && user.CDate.CompareTo(DateTime.Now.AddDays(-3)) > 0) {
        UrlMaker.Redirect("ErrOnProbation.aspx");
      } else 
      * /
      if (user.FDisWrite) {
        UrlMaker.Redirect("ErrWriteDisabled.aspx");
      } else if (Folder.DisableGuestReply && !IsFolderAdmin) {
        Page.ShowNotAllowed();
      }
    }

    public void CheckPermForEdit(SqlConnection conn) {
      Page.Assert(ArticleID > 0);
      
      ReadFolder(conn);

      IsFirstArticle = ThreadID == ArticleID;
      IsArticleOwner = ArticleUserID == Page.UserID;

      if (Page.User.FDisWrite) {
        UrlMaker.Redirect("ErrWriteDisabled.aspx");
      } else if (!IsArticleOwner && !IsFolderAdmin) {
        Page.ShowNotAllowed();
      }

      switch (Folder.OwnerType) {
        case Folder.OwnerTypePublic:
          IsEditable = Page.IsBBSAdmin || IsArticleOwner;
          IsEditTimedOut = ArticleCDate.CompareTo(DateTime.Now.AddMinutes(-10)) < 0;
          IsContentEditable = Page.IsBBSAdmin || (IsEditable && !IsEditTimedOut);
          break;
        case Folder.OwnerTypeBox:
          IsEditable = Page.IsBBSAdmin || IsArticleOwner;
          IsContentEditable = IsEditable;
          break;
        default:
          Page.AssertFailed();
          break;
      }

    }

    public void CheckPermForDelete(SqlConnection conn) {
      Page.Assert(ArticleID > 0);
      
      ReadFolder(conn);

      IsFirstArticle = ThreadID == ArticleID;
      IsArticleOwner = ArticleUserID == Page.UserID;

      if (!IsArticleOwner && !IsFolderAdmin) {
        Page.ShowNotAllowed();
      }

      switch (Folder.OwnerType) {
        case Folder.OwnerTypePublic:
          IsEditTimedOut = ArticleCDate.CompareTo(DateTime.Now.AddMinutes(-10)) < 0;
          IsDeletable = Page.IsBBSAdmin || IsArticleOwner && !IsEditTimedOut;
          break;
        case Folder.OwnerTypeBox:
          IsDeletable = IsFolderAdmin || IsArticleOwner;
          break;
        default:
          Page.AssertFailed();
          break;
      }
    }

    public void CheckPermForHidden(bool hidden, int threadOwnerID) {
      if (hidden && !IsFolderAdmin && threadOwnerID != Page.UserID) {
        Page.ShowNotAllowed();
      }
    }

    //
    //
    //    Attach Mode
    //    

    public int AttachModeForNewThread() {
      if (Folder.Attach && (!Folder.AttachOwnerOnly || IsFolderAdmin)) {
        if (Folder.AttachMultiple) {
          return 2;
        } else {
          return 1;
        }
      }
      return 0;
    }

    public int AttachModeForReply() {
      if (Folder.Attach && Folder.AttachOnReply && (!Folder.AttachOwnerOnly || IsFolderAdmin)) {
        if (Folder.AttachMultiple) {
          return 2;
        } else {
          return 1;
        }
      }
      return 0;
    }

    //
    //
    //    Return to List
    //    

    public void ReturnToView() {
      if (ViewMode != 'S') {
        / * FSel.aspx -> XXX.aspx 경우를 위해'l' 인자를 삭제한다 * /
        UrlMaker.DeleteParam("l");
      }
      UrlMaker.Redirect("View.aspx");
    }

    public string GetCleanFolderListViewUrl() {
      string url;
      switch(Function) {
        case FuncBox:
          url = UrlMaker.GetUrl("View.aspx",false) + "?f=" + FuncBox + "&u=" + Page.OwnerID;
          break;
        default: // FuncPublic
          url = UrlMaker.GetUrl("View.aspx",false) + "?f=" + FuncPublic;
          break;
      }
      return url;
    }


    //
    //
    //    Photo View
    //

    public string RefPhotoScript = null;

    public void SetRefPhotoScript(SqlConnection conn) {
      if (RefPhotoScript == null) {
        SqlCommand cmd;
        SqlDataReader reader;

        int p = PhotoID;
        int u = 0;
        int border = 0;

        if (p == 0 && ThreadID > 0) {
          cmd = new SqlCommand("BBSSelectPhoto", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = ThreadID;
          reader = cmd.ExecuteReader();
          if (reader.Read()) {
            p = (int)reader["PhotoID"];
            u = (int)reader["UserID"];
            border = (byte)reader["Border"];
          }
          reader.Close();
        } else if (p != 0) {
          cmd = new SqlCommand("PhotoSelect", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value = p;
          reader = cmd.ExecuteReader();
          if (reader.Read()) {
            u = (int)reader["UserID"];
            border = (byte)reader["Border"];
          }
          reader.Close();
        }
        RefPhotoScript = p > 0 ? WebSite.Com.Photo.PhotoContext.GetRefPhotoScript(u, p, border, true) : String.Empty; 
      }
    }

  }


procedure BBSSelectContext
  @ThreadID int = 0
  ,@ArticleID int = 0
  ,@FolderID int = 0
  as

  if (@ThreadID != 0)
    select F.*
    from 
      BBSThreads T join BBSFolders F on F.FolderID = T.FolderID
    where 
      T.ThreadID = @ThreadID
  else
    select *
    from 
      BBSFolders
    where 
      FolderID = @FolderID

  if (@ArticleID != 0) -- Edit 
    select A.UserID , A.CDate
    from 
      BBSArticles A join BBSThreads T on A.ThreadID = T.ThreadID
    where 
      A.ArticleID = @ArticleID and
      T.ThreadID = @ThreadID
go


procedure BBSUnsubscribe
  @UserID int
  ,@ThreadID int
  as

  --*
  begin tran
    if (
      not exists (
        select * 
        from BBSArticles 
        where UserID = @UserID and ThreadID = @ThreadID
      )
    )
      delete from BBSUsersThreads
      where UserID = @UserID and ThreadID = @ThreadID
  commit tran
  --*

  delete from BBSUsersThreads
  where UserID = @UserID and ThreadID = @ThreadID
go


procedure BBSSubscribe
  @UserID int
  ,@ThreadID int
  as

  begin tran
    if (
      not exists (
        select * 
        from BBSUsersThreads 
        where UserID = @UserID and ThreadID = @ThreadID
      )
    )
      insert BBSUsersThreads(UserID, ThreadID)
      values(@UserID, @ThreadID)
  commit tran
go

procedure BBSSelectArticleUserID
  @ArticleID  int
  ,@UserID int output
  as

  select @UserID = UserID
  from BBSArticles
  where ArticleID = @ArticleID
*/
